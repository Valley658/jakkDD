const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// SQLite DB 설정
const db = new sqlite3.Database('server_log.db', (err) => {
    if (err) {
        console.error('Could not open database', err);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// DB 테이블 생성 (로그인 정보 저장)
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
)`);

// DB에 관리자 정보 추가 (초기 설정)
db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['admin', 'reewsii13@gm'], (err) => {
    if (err && !err.message.includes('UNIQUE constraint')) {
        console.error('Error inserting admin user', err);
    }
});

// 서버 로그 저장 경로
app.post('/server_log', (req, res) => {
    const { log } = req.body;
    if (log) {
        console.log('Received log:', log);
        res.status(200).send('Log received');
    } else {
        res.status(400).send('No log provided');
    }
});

// 로그인 처리 경로
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            return res.status(500).send('Error checking credentials');
        }
        if (row) {
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

// 서버 실행
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
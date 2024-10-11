// DOM Elements
const tokenGenBtn = document.getElementById('token-gen-btn');
const ipGenBtn = document.getElementById('ip-gen-btn');
const tokenGenerator = document.getElementById('token-generator');
const ipGenerator = document.getElementById('ip-generator');
const generateTokenBtn = document.getElementById('generate-token-btn');
const tokenOutput = document.getElementById('token-output');
const tokenCountInput = document.getElementById('token-count');
const generateIpBtn = document.getElementById('generate-ip-btn');
const ipOutput = document.getElementById('ip-output');
const ipCountInput = document.getElementById('ip-count');  // IP 입력 수 추가
const themeToggle = document.getElementById('theme-toggle');
const clearTokenBtn = document.getElementById('clear-token-btn');  // Clear Token 버튼
const clearIpBtn = document.getElementById('clear-ip-btn');        // Clear IP 버튼
const body = document.body;
const logSection = document.createElement('div'); // 로그 섹션 추가
logSection.id = 'log-section';
document.body.appendChild(logSection);

// Switch between Token Generator and IP Generator
tokenGenBtn.addEventListener('click', () => {
    ipGenerator.classList.add('hidden');
    tokenGenerator.classList.remove('hidden');
    logMessage("Switched to Token Generator");
});

ipGenBtn.addEventListener('click', () => {
    tokenGenerator.classList.add('hidden');
    ipGenerator.classList.remove('hidden');
    logMessage("Switched to IP Generator");
});

// Token generation logic
function generateToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = 'M';
    for (let i = 0; i < 63; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

generateTokenBtn.addEventListener('click', () => {
    const tokenCount = parseInt(tokenCountInput.value, 10);
    if (tokenCount > 100) {
        alert('Token count too high, generating quickly...');
        logMessage("High token count, quick generation.");
    }
    let tokens = [];
    for (let i = 0; i < tokenCount; i++) {
        tokens.push(generateToken());
    }
    tokenOutput.textContent = tokens.join('\n');
    tokenOutput.style.color = 'yellow';  // 토큰 색상 변경
    logMessage(`Generated ${tokenCount} tokens`);
});

// Clear Token 버튼 클릭 시
clearTokenBtn.addEventListener('click', () => {
    tokenOutput.textContent = '';
    logMessage("Cleared tokens");
});

// IP Generation logic
generateIpBtn.addEventListener('click', () => {
    const ipCount = parseInt(ipCountInput.value, 10);  // 여러 개의 IP 생성
    if (ipCount > 100) {
        alert('Too many IPs requested, generating quickly...');
        logMessage("High IP count, quick generation.");
    }
    let ips = [];
    for (let i = 0; i < ipCount; i++) {
        const ip = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
        ips.push(ip);
    }
    ipOutput.textContent = ips.join('\n');
    logMessage(`Generated ${ipCount} IPs`);
});

// Clear IP 버튼 클릭 시
clearIpBtn.addEventListener('click', () => {
    ipOutput.textContent = '';
    logMessage("Cleared IPs");
});

// Dark/Light mode toggle
themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        logMessage("Switched to Light Mode");
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        logMessage("Switched to Dark Mode");
    }
});

// 로그 메시지 출력 및 서버로 보내기
function logMessage(message) {
    const logItem = document.createElement('p');
    logItem.textContent = message;
    logSection.appendChild(logItem);

    // 서버로 로그 메시지 전송
    fetch('/server_log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ log: message })
    })
    .catch(error => console.error('Error sending log:', error));
}

// Block all suspicious network requests related to "cmd" or suspicious commands
const originalFetch = window.fetch;
window.fetch = function (...args) {
    const suspiciousTerms = ['ping', 'cmd', 'vpn', 'proxy', 'bash', 'sh', 'admin', 'root'];
    if (suspiciousTerms.some(term => args[0].includes(term))) {
        logMessage('Blocked a suspicious network request.');
        return new Promise((resolve, reject) => {
            reject(new Error('Blocked a suspicious request'));
        });
    }
    return originalFetch(...args);
};

// 의심스러운 XMLHttpRequest도 차단
const originalXhrOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url) {
    const suspiciousTerms = ['ping', 'cmd', 'vpn', 'proxy', 'bash', 'sh', 'admin', 'root'];
    if (suspiciousTerms.some(term => url.includes(term))) {
        logMessage('Blocked a suspicious XMLHttpRequest.');
        throw new Error('Blocked a suspicious XMLHttpRequest');
    }
    return originalXhrOpen.apply(this, arguments);
};

// Form submit 차단
document.addEventListener('submit', function (event) {
    const formAction = event.target.action || '';
    const suspiciousTerms = ['ping', 'cmd', 'vpn', 'proxy', 'bash', 'sh', 'admin', 'root'];
    if (suspiciousTerms.some(term => formAction.includes(term))) {
        event.preventDefault();
        logMessage('Blocked a suspicious form submission.');
    }
});

// VPN 감지 및 리디렉션
function detectVPN() {
    fetch('https://api.ipify.org?format=json') // 사용자의 공용 IP 확인
        .then(response => response.json())
        .then(data => {
            const vpnIPs = ['123.123.123.123', '111.222.333.444']; // VPN IP 목록 추가
            if (vpnIPs.includes(data.ip)) {
                logMessage("VPN detected, redirecting...");
                window.location.href = "https://vpn-users-only.example.com"; // VPN 사용자 전용 사이트로 리디렉션
            }
        })
        .catch(() => logMessage("Failed to detect VPN"));
}

detectVPN(); // 페이지 로드 시 VPN 감지 실행

// Content Security Policy 적용
function applyCSP() {
    const metaTag = document.createElement('meta');
    metaTag.httpEquiv = "Content-Security-Policy";
    metaTag.content = "default-src 'self'; script-src 'self'; connect-src 'self' https://api.ipify.org; style-src 'self'; img-src 'self';";
    document.getElementsByTagName('head')[0].appendChild(metaTag);
    logMessage("Applied Content Security Policy (CSP)");
}

applyCSP();
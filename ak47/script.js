var ak47Btn = document.getElementById('ak47-btn');
var body = document.body;
var clickCount = 0;
var intervalId = null;

ak47Btn.addEventListener('click', function() {
  clickCount++;

  if (clickCount === 1) {
    intervalId = setInterval(function() {
      var audio = new Audio('ak.mp3');
      audio.volume = 1.0
      audio.play();
      if (body.style.backgroundColor === 'blue') {
        body.style.backgroundColor = 'red';
      } else {
        body.style.backgroundColor = 'blue';
      }
    }, 1);
  }
});

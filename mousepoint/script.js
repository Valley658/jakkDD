alert("마우스를 움직여보세요!")
alert("아래로 스크롤하면 다시 이전 페이지로 돌아 갈수 있어요")
document.addEventListener('mousemove', function(event) {
    var dot = document.getElementById('dot');
    var x = event.clientX;
    var y = event.clientY;
  
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
  });
  
  setInterval(changeColor, 50);
  
  function changeColor() {
    var dot = document.getElementById('dot');
    var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    dot.style.backgroundColor = randomColor;
  }
  
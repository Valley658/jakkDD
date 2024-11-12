alert("슬라이더의 오른쪽을 눌러보세요")
alert("슬라이더의 왼쪽을 눌러보세요")

var slider = document.getElementById('slider');
var knob = document.getElementById('knob');
var message = document.getElementById('message');

slider.addEventListener('mousemove', function(event) {
  var sliderWidth = slider.clientWidth;
  var knobWidth = knob.offsetWidth;
  var x = event.clientX - slider.getBoundingClientRect().left;

  if (x < 0) {
    x = 0;
  } else if (x > (sliderWidth - knobWidth)) {
    x = sliderWidth - knobWidth;
  }

  knob.style.left = x + 'px';
});

slider.addEventListener('mouseleave', function() {
  knob.style.left = '0';
});

slider.addEventListener('mouseup', function() {
  var knobPosition = parseInt(knob.style.left);
  var sliderWidth = slider.clientWidth;
  var knobWidth = knob.offsetWidth;

  if (knobPosition <= (sliderWidth - knobWidth) / 2) {
    message.textContent = 'LEFT';
  } else {
    message.textContent = 'RIGHT';
  }
});

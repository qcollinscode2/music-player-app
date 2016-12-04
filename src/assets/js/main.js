var playButton = document.querySelectorAll('.fa-play')[0];
playButtonOpacity = playButton.style.color;
playButton.style.color = "grey";

$(playButton).each(function() {
  var elem = $(this);
  setInterval(function() {
    var visibility = elem.css('visibility') == 'hidden' ? elem.css('visibility', 'visible') : elem.css('visibility', 'hidden');
  }, 500)
});
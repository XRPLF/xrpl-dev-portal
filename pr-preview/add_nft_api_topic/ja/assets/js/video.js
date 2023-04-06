
$(document).ready(()=> {

  //top video. Show inline replacing image
  $("#playvideo").click(function(event){
    $("#playvideo").hide();
    $("#video1").show();
    $("#video1")[0].src += "?autoplay=1";
    event.preventDefault()
  });

  //bottom 3. Show in overlay
  $('.btn1').click(function(event) {
    var src = $(this).attr("data-url");
    $("#player").attr("src", src);
    $('#video, #video-overlay').fadeIn('slow');
    event.preventDefault()
  });

});

$(document).on('touchend, mouseup', function(e) {
  if (!$('#video').is(e.target)) {
    $('#video, #video-overlay').fadeOut('slow');
    $("#player").attr("src", '');
  }
});

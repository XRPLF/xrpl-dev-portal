$(document).ready(function() {

  // Mobile menu.  
  $('[data-toggle="slide-collapse"]').on('click', function() {
    $navMenuCont = $($(this).data('target'));
    $navMenuCont.toggleClass('show');
    $(".menu-overlay").toggleClass('active');
  });
  $(".menu-overlay").click(function(event) {
    $(".navbar-toggler").trigger("click");
  });
  





  var TO_TOP_MIN = 50;
  var TO_TOP_SPEED = 500;
  var TO_TOP_POS = 0;
  $(window).scroll(function () {
    if ($(this).scrollTop() > TO_TOP_MIN) {
       $('.jump-to-top').fadeIn();
    } else {
       $('.jump-to-top').fadeOut();
    }
  });
  $(".jump-to-top").click(function() {
    $("body").animate({scrollTop: TO_TOP_POS}, TO_TOP_SPEED)
  });
});

$(document).ready(function() {

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
    $("html").animate({scrollTop: TO_TOP_POS}, TO_TOP_SPEED)
  });

  // TODO: put this somewhere better.
  // Code to make other menu items hide on mobile when we expand one
  $("#topnav-pages .dropdown").on("show.bs.dropdown", (evt) => {
    $("#top-main-nav").addClass("submenu-expanded")
  })
  $("#topnav-pages .dropdown").on("hidden.bs.dropdown", (evt) => {
    $("#top-main-nav").removeClass("submenu-expanded")
  })
});

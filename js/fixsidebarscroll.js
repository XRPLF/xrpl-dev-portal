$(window).scroll(function() {
   var footerpos = parseInt($(".footer").offset().top);
   var scrollpos = $(window).scrollTop() + $(window).height();
   if(scrollpos - footerpos > 0) {
       $(".menubar.fixed").css("margin-bottom", scrollpos-footerpos);
   } else {
       $(".menubar.fixed").css("margin-bottom", 0);
   }
});

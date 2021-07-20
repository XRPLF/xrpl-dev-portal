$(window).scroll(function() {
   var footerpos = parseInt($("footer").offset().top);
   var scrollpos = $(window).scrollTop() + $(window).height();
   if(scrollpos - footerpos > 0) {
       $("aside.sidebar .dev_nav_wrapper").css("bottom", (scrollpos-footerpos)+"px");
   } else {
       $("aside.sidebar .dev_nav_wrapper").css("bottom", 0);
   }
});

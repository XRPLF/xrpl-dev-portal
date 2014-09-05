$(window).scroll(function() {
   if($(window).scrollTop() + $(window).height() > $(document).height() - 183) {
       $(".menubar.fixed").addClass("leaveroomforfooter");
   } else {
       $(".menubar.fixed").removeClass("leaveroomforfooter");
   }
});

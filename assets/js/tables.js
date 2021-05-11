// Add class to tables for scrolling on small devices
jQuery(document).ready(function($) {
    var alterClass = function() {
        $('table').addClass('table-responsive');
    };
    //Fire it when the page first loads:
    alterClass();
  });
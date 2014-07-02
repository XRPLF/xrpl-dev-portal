$(document).on('flatdoc:ready', function() {
    $('code').dblclick(function(eo) {
        $(eo.target).toggleClass('expanded');
    });
    $('code').attr('title', 'Double-click to expand/collapse');
});

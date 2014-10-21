function make_code_expandable() {
    $('code').dblclick(function(eo) {
        $(eo.target).toggleClass('expanded');
    });
    $('code').attr('title', 'Double-click to expand/collapse');
}

$(document).on('flatdoc:ready', make_code_expandable);

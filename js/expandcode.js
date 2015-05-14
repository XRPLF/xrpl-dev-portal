var toggle_cs = function(eo) {
    //eo = $("#"+id);
    var wrapper = $(eo.target).parent();
    wrapper.find("code").toggleClass('expanded');
    current_button_text = wrapper.find(".code_toggler").val();
    $(eo.target).val(current_button_text == 'Expand' ? "Collapse" : "Expand");
}

function make_code_expandable() {
    var newid = 0;
    $(".content > pre > code").parent().wrap(function() {
        newid = newid+1;
        return "<div class='code_sample' id='code_autoid_"+newid+"'>";
    });

    var cs = $('.code_sample');
    cs.find("code").dblclick(function(eo) {
        $(eo.target).toggleClass('expanded');
    });
    cs.find("code").attr('title', 'Double-click to expand/collapse');
    var newbtn = $("<input type='button' class='code_toggler' value='Expand' />");
    newbtn.appendTo(cs);
    $(".code_toggler").click(toggle_cs);
}

$(document).on('flatdoc:ready', make_code_expandable);

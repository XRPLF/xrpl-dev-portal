const tExpand='<i class="fa fa-expand"></i><span class="sr-only">Expand</span>'
const tCollapse='<i class="fa fa-compress"></i><span class="sr-only">Shrink</span>'

function toggle_cs(eo) {
    const wrapper = $(eo.target).closest(".code_sample");
    const code_el = wrapper.find("code");
    code_el.toggleClass('expanded');
    const placeholders = wrapper.find(".code-placeholder");
    if (placeholders.length) {
        // collapsing
        placeholders.remove();
        // This caused jumping around when code was closed.
        // $(window).scrollTop(code_el.offset().top - 124)
    } else {
        code_el.after("<div class='code-placeholder' style='width:"
                            + code_el.outerWidth()
                            + "px; height:"
                            + (code_el.outerHeight() - 20) // added 20 to cover bottom scrollbar
                            + "px;'>&nbsp;</div>");
    }
    current_button_expanded = code_el.hasClass('expanded');
    $(wrapper.find(".code_toggler")).html(current_button_expanded ? tCollapse : tExpand);
}

function has_scrollbars(e) {
  if ($(e).parents(".multicode").length > 0) {
    //TODO: figure out if we can detect scrollbars on non-default tabs of
    // multicode samples. For now, always consider multi-code sections to need
    // scrollbars.
    return true;
  }
  return (e.scrollHeight > e.clientHeight) || (e.scrollWidth > e.clientWidth);
}

function make_code_expandable() {
    var newid = 0;
    $(".content > pre > code").parent().wrap(function() {
        newid = newid+1;
        return "<div class='code_sample' id='code_autoid_"+newid+"'>";
    });

    // Multi code blocks
    var code_samples = $('.code_sample');
    code_samples.find("code").each(function() {
      let jqThis = $(this);
      if (has_scrollbars(this)) {
        jqThis.dblclick(toggle_cs);
        jqThis.attr('title', 'Double-click to expand/collapse');
        var newbtn = $(`<button class='code_toggler btn btn-outline-secondary'>${tExpand}</button>`);
        newbtn.appendTo(jqThis.parents(".codehilite").children(".btn-group"));
      }
    });

    $(".code_toggler").click(toggle_cs);

    /* fix expand/collapse and tab click hierarchy */
    code_samples.css("position","relative");
    $(".multicode .code_sample").css("position","static");
}

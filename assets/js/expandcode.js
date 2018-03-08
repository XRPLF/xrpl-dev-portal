var toggle_cs = function(eo) {
    //eo = $("#"+id);
    var wrapper = $(eo.target).parent();
    var code_el = wrapper.find("code");
    code_el.toggleClass('expanded');
    var placeholders = wrapper.find(".code-placeholder");
    if (placeholders.length) {
        placeholders.remove();
    } else {
        code_el.after("<div class='code-placeholder' style='width:"
                            + code_el.width()
                            + "px; height:"
                            + code_el.height()
                            + "px;'>&nbsp;</div>");
    }
    current_button_text = wrapper.find(".code_toggler").val();
    $(eo.target).val(current_button_text == 'Expand' ? "Collapse" : "Expand");
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

    var code_samples = $('.code_sample');
    code_samples.find("code").each(function() {
      let jqThis = $(this);
      if (has_scrollbars(this)) {
        jqThis.dblclick(toggle_cs);
        jqThis.attr('title', 'Double-click to expand/collapse');
        var newbtn = $("<input type='button' class='code_toggler' value='Expand' />");
        newbtn.appendTo(jqThis.parents(".code_sample"));
      }
    });

    $(".code_toggler").click(toggle_cs);

    /* fix expand/collapse and tab click hierarchy */
    code_samples.css("position","relative");
    $(".multicode .code_sample").css("position","static");
}

// Original code to adapt the markup for tabs.
// Expects markup in the form of:
// <div class='multicode'>
//   <em>tab 1 title</em>
//   <code>tab 1 code block</code>
//   <em>tab 2 title</em>
//   <code>tab 2 code block</code>
// </div>
jQuery.fn.multicode_tabs = function() {
    $('.multicode').each(function(index,el) {
        cb_area = $(el);
        cb_area.attr('id', "code-"+index);
        // make a ul to house the tab headers
        cb_area.prepend("<ul class='codetabs'></ul>");
        
        // for each code, give it a unique ID and wrap it in a pre
        cb_area.children('code').each(function(index2,el2) {
            var linkid = 'code-'+index+'-'+index2;
            $(el2).wrap("<div id='"+linkid+"' class='code_sample'><pre>");
            //also put in a link to this in the tab header ul
            $('ul', cb_area).append("<li><a href='#"+linkid+"'></a></li>");
        });
        
        //use the ems to fill in the tab headers for each block
        $(el).children('em').each(function(index2, el2) {
            $('ul li:eq('+index2+') a', cb_area).text($(el2).text());
        });
    });
    $('.multicode em').hide();
    
    $('.multicode').minitabs();
}


// Variant version for the HTML that Pandoc generates
// Expects markup in the form of:
// <div class='multicode'>
//   <p><em>tab 1 title</em></p>
//   <pre><code>tab 1 code block</code></pre>
//   <p><em>tab 2 title</em></p>
//   <pre><code>tab 2 code block</code></pre>
// </div>
jQuery.fn.multicode_tabs_pandoc = function() {
    $('.multicode').each(function(index,el) {
        cb_area = $(el);
        cb_area.attr('id', "code-"+index);
        // make a ul to house the tab headers
        cb_area.prepend("<ul class='codetabs'></ul>");
        
        cb_area.children('pre').each(function(index2,el2) {
            var linkid = 'code-'+index+'-'+index2;
            $(el2).wrap("<div id='"+linkid+"'>");
            //also put in a link to this in the tab header ul
            $('ul', cb_area).append("<li><a href='#"+linkid+"'></a></li>");
        });
        
        $(el).find('em').each(function(index2, el2) {
            $('ul li:eq('+index2+') a', cb_area).text($(el2).text());
        });
    });
    $('.multicode p').hide();
    
    $('.multicode').minitabs();
}

// Minitabs adapted from https://code.google.com/p/minitabs/
// Changes made: support multiple tab booklets in one page
/*
The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
*/

jQuery.fn.minitabs = function(speed,effect) {
  this.each(function() {
      var id = "#" + $(this).attr('id')
      $(id + ">DIV:gt(0)").hide();
      $(id + ">UL>LI>A:first").addClass("current");
      $(id + ">UL>LI>A").click(
        function(){
          $(id + ">UL>LI>A").removeClass("current");
          $(this).addClass("current");
          $(this).blur();
          var re = /([_\-\w]+$)/i;
          var target = $('#' + re.exec(this.href)[1]);
          var old = $(id + ">DIV");
          switch (effect) {
            case 'fade':
              old.fadeOut(speed).fadeOut(speed);
              target.fadeIn(speed);
              break;
            case 'slide':
              old.slideUp(speed);  
              target.fadeOut(speed).fadeIn(speed);
              break;
            default : 
              old.hide(speed);
              target.show(speed)
          }
          return false;
        }
     );
 });
}

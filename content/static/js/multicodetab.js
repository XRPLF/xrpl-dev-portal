//-------- this multicode stuff has been migrated to a Dactyl filter ---------
// Expects markup in the form of:
// <div class='multicode'>
//   <p><em>tab 1 title</em></p>
//   <pre><code>tab 1 code block</code></pre>
//   <p><em>tab 2 title</em></p>
//   <pre><code>tab 2 code block</code></pre>
// </div>
// jQuery.fn.multicode_tabs = function() {
//     $('.multicode').each(function(index,el) {
//         cb_area = $(el);
//         cb_area.attr('id', "code-"+index);
//         // make a ul to house the tab headers
//         cb_area.prepend("<ul class='codetabs'></ul>");
//
//         cb_area.children('pre').each(function(index2,el2) {
//             var linkid = 'code-'+index+'-'+index2;
//             $(el2).wrap("<div id='"+linkid+"' class='code_sample'>");
//             //also put in a link to this in the tab header ul
//             $('ul', cb_area).append("<li><a href='#"+linkid+"'></a></li>");
//         });
//
//         $(el).find('em').each(function(index2, el2) {
//             $('ul li:eq('+index2+') a', cb_area).text($(el2).text());
//         });
//     });
//     $('.multicode p').hide();
//     $('.multicode .code_sample').css("position","static");
//
//     $('.multicode').minitabs();
// }

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

  function saveToLocal(lang){
    window.localStorage.setItem('user-preferred-devlanguage', lang);
  }

  function setTabsToFirst(id){
    $(".multicode[id='"+id+"']" + ">DIV").hide();   
    $(".multicode[id='"+id+"']" + ">UL>LI>A").removeClass("current"); 
    // 
    $(".multicode[id='"+id+"']" + ">DIV:first").show(); 
    $(".multicode[id='"+id+"']" + ">UL>LI>A:first").addClass("current");
  }

  function setTabsToLang(id, lang){
    $(".multicode[id='"+id+"']" + ">DIV").hide();   
    $(".multicode[id='"+id+"']" + ">UL>LI>A").removeClass("current"); 
    //
    $(".multicode[id='"+id+"']" + ">UL>LI>A[class="+lang+"]").addClass("current");
    $(".multicode[id='"+id+"']" + ">DIV."+lang).show();
  }

  function showSelectedTabFromSaved(id){
    var savedValue = window.localStorage.getItem('user-preferred-devlanguage');

    if(savedValue !== null) {
      showSlectedTab(savedValue);
    }else {
      setTabsToFirst(id);
    }
  }

  function showSlectedTab(lang) {
    $('.multicode').each(function() {
      var hasLang = false;
      $(this).find(">UL>LI>A").each(function() {
        if ($(this).attr('class') == lang ) { 
          hasLang = true;
        }
      })

      if(hasLang) {
        setTabsToLang($(this).attr('id'), lang);
      } else {
        setTabsToFirst($(this).attr('id'));
      }
    })

    // save in localstorage.
    saveToLocal(lang);
  }

  this.each(function() {
      var id = "#" + $(this).attr('id')
      //Use saved value or set to first tab
      showSelectedTabFromSaved($(this).attr('id'));

      //Add click on each tab
      $(id + ">UL>LI>A").click(
        function(){
          if(!$(this).hasClass("current") ){
            showSlectedTab($(this).attr('class'))
          }
          return false;
        }
     );
 });
}

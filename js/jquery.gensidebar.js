$(document).ready(function() {
   tableOfContents = $("<ul class='tableofcontents'>").appendTo(".menubar > .menu.section")
   $("h1, h2, h3").each(function() { 
        indent_level = this.tagName.toLowerCase().substr(1);
        if (this.id) { //only show headers with IDs. which should be all of them.
            href = "#"+this.id;
            $("<li class='level-"+indent_level+"'><a href='"+href+"'>"+
                $(this).text()+"</a></li>").appendTo(tableOfContents); 
        } 
        
    });
});


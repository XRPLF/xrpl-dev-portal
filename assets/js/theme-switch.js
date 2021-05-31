// Check user prefers color, toggle light/dark, save state
// Based partly on https://github.com/vinorodrigues/bootstrap-dark

$(document).ready(function() {

//////// NOTES
// On mac the system will be either light, dark or auto.  Auto will return either light or dark and NOT no preference. 
// If users have set to auto then light will default durring daylight hours.  
// Option 1 is to NOT respect user-prefers-color and only respect a toggle. This will default to a dark theme with light being optional. 
// Option 2 is respect user-prefers-color at first. This will likely load the light theme during daylight. And switch auto. Then if user toggles switch we then respect that as override. 

    // function to toggle the css
    function toggle_color_scheme_css($mode) {
      // amend the body classes
      if ($mode == 'dark') {
        $("html").removeClass('light').addClass("dark");
      } else {
        $("html").removeClass("dark").addClass('light');
      }
      // if on user prefers color then update stored value
      $upc = window.localStorage.getItem('user-prefers-color');
      if ($upc !== null) {
        // if ($upc == 0) $("#css-save-btn").prop( "checked", true );  // first time click
        window.localStorage.setItem('user-prefers-color', ($mode == 'dark') ? 2 : 1);
      }
    }

    // function / listener action to toggle the button
    function update_color_scheme_css() {
      $upc = window.localStorage.getItem('user-prefers-color');
      if (($upc === null) || ($upc == 0)) {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: no-preference)").matches){
          $mode = 'dark';
        }else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches){
          $mode = 'light';
        }else{
          $mode = 'dark';
        }
      } else {
        $mode = ($upc == 2) ? 'dark' : 'light';
      }
      $("#css-toggle-btn").prop( "checked", ('dark' == $mode) );
      toggle_color_scheme_css($mode);
    }

    // initial mode discovery & update button
    update_color_scheme_css();

    // update every time it changes
    if (window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addListener( update_color_scheme_css );

    // toggle button click code
    $("#css-toggle-btn").bind("click", function() {
      // disable further automatic toggles
      if (window.localStorage.getItem('user-prefers-color') === null)
        window.localStorage.setItem('user-prefers-color', 0);
      // get current mode, i.e. does body have the `.dark`` classname
      $mode = $("html").hasClass("dark") ? 'light' : 'dark';
      $upc = $("html").hasClass("dark") ? 1 : 2;
      window.localStorage.setItem("user-prefers-color", $upc);
      toggle_color_scheme_css($mode);
    });

})
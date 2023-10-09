// Check user prefers color, toggle light/dark, save state
// Based loosely on https://github.com/vinorodrigues/bootstrap-dark

function apply_color_scheme(theme) {
  const disable_theme = (theme == "dark") ? "light" : "dark";
  document.documentElement.classList.add(theme)
  document.documentElement.classList.remove(disable_theme)
  // $("#css-toggle-btn").prop( "checked", (theme == 'dark') );
}

function auto_update_theme() {
  const upc = window.localStorage.getItem('user-prefers-color')
  let theme = "dark"; // Default to dark theme
  if (!upc) {
    // User hasn't saved a preference specifically for this site; check
    // the browser-level preferences.
    if (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches) {
      theme = "light"
    }
  } else { // Follow user's saved setting.
    theme = (upc == "light") ? "light" : "dark"
  }
  apply_color_scheme(theme)
}

function user_toggle_theme() {
  const new_theme = document.documentElement.classList.contains("dark") ? "light" : "dark"
  window.localStorage.setItem("user-prefers-color", new_theme)
  // Animate this style switch, but not the ones that happen on page load:
  document.body.style.transition = "background-color .2s ease"
  apply_color_scheme(new_theme)
}

auto_update_theme()
// update automatically if the user's theme preference changes
if (window.matchMedia) {
  window.matchMedia("(prefers-color-scheme: dark)").addListener( auto_update_theme )
}
// Note: .addListener is considered deprecated, and is supposed to be updated to
// addEventListener("change", callback) instead; however, as recently as macOS
// High Sierra (~2017-2018) Safari does not support addEventListener here.

window.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById("css-toggle-btn").onclick = user_toggle_theme
})

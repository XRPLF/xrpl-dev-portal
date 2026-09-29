// Check user prefers color, toggle light/dark, save state.
// Loaded synchronously in <head> via redocly.yaml `scripts.head` so the
// correct theme is applied before first paint on every page load. This is
// what makes the user's dark/light preference (stored in
// `localStorage["user-prefers-color"]`) persist across page navigations.
//
// The Navbar's `ModeToggleButton` (NavControls.tsx) and the mobile menu's
// toggle (MobileMenu.tsx) are responsible for *writing* the preference and
// flipping the `dark`/`light` class on `<html>`; this script is responsible
// for *reading* the preference on load and re-applying the class.

(function () {
  function apply_color_scheme(theme) {
    const disable_theme = (theme === "dark") ? "light" : "dark";
    document.documentElement.classList.add(theme);
    document.documentElement.classList.remove(disable_theme);
    document.documentElement.setAttribute("data-theme", theme);
  }

  function auto_update_theme() {
    let upc = null;
    try {
      upc = window.localStorage.getItem("user-prefers-color");
    } catch (_) {
      // localStorage may be unavailable (private mode, sandboxed iframe, etc.)
    }

    let theme = "dark"; // Default to dark theme
    if (!upc) {
      // No saved preference — fall back to the browser-level setting.
      if (window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: light)").matches) {
        theme = "light";
      }
    } else {
      theme = (upc === "light") ? "light" : "dark";
    }
    apply_color_scheme(theme);
  }

  auto_update_theme();

  // Re-apply when the OS-level color scheme changes, but only when the user
  // hasn't pinned an explicit preference for this site.
  if (window.matchMedia) {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = function () {
      let hasExplicit = false;
      try {
        hasExplicit = !!window.localStorage.getItem("user-prefers-color");
      } catch (_) {}
      if (!hasExplicit) auto_update_theme();
    };
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else if (mql.addListener) {
      // Legacy Safari (<14) fallback.
      mql.addListener(onChange);
    }
  }
})();

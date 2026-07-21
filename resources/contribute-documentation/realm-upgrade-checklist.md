# Realm Upgrade Checklist

The following is a list of things to manually double-check when testing a major upgrade to Redocly Realm, any of its dependencies, or other aspects of the site's underlying technology. This checklist is based on things that have broken in past upgrades.

- Dev server starts and does not report any errors in the console.
- Homepage displays correctly (`http://localhost:4000`) and main navigation works.
- Docs landing page displays (`http://localhost:4000/docs`)
- Search function displays and text is legible in both light mode and dark mode.
- Auto-generated landing pages using `{% child-pages /%}` tool display correctly.
- All in-site dev tools work, including:
    - RPC Tool
    - WebSocket API Tool
    - xrp-ledger.toml Checker
    - XRP Faucets
- Known Amendments page displays correctly and so does its "View as Markdown" equivalent (`http://localhost:4000/resources/known-amendments.md`)
- The blog homepage displays a list of blog entries (`http://localhost:4000/blog`)
- Individual doc pages display correctly and are legible.
- The language switcher works and translated pages display correctly.
- The mobile version of the site is readable and navigation works.
- Redirects work correctly. For example `http://localhost:4000/offers.html` redirects to the Offers concept page.

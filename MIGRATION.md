Migration TODO:

- Move i18n files to correct folder
  - I moved only one folder manually `concepts/introduction`
- Migrate links
  - absolute paths in translation folders should start from locale,
    see content/@i18n/ja/concepts/introduction/crypto-wallets.md file for example (the last line)
- Generate redirects.yaml
- Replace snippets (include with partial)
  - Feature request: configure snippet folder - not started yet by Redocly
- Migrate html pages to react pages, with translations
  - Example usage in index.page.tsx
  - Script for generationg translations.yaml is - in-progress by Redocly
  - Potentially we'll add native support for .po, .mo files
- Interactive pages
  - Event hook for page visited (similar to document contentdomready) - in progress by Redocly
- Autogenerate index pages
  - Created example plugin, uses the order from the sidebars (it uses some internals but we'll expose them later)

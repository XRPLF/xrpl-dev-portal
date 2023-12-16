#!/bin/bash

# Migrate links script. Requires a "working"(ish) Dactyl build, so it should be run before md_dactyl_to_redocly.py or convert-code-blocks.cjs

# 1. Blank the snippets that contain reusable links, so the md reference links will remain unparsed as [Link text][]
truncate -s 0 content/_snippets/rippled-api-links.md
truncate -s 0 content/_snippets/tx-type-links.md
truncate -s 0 content/_snippets/rippled_versions.md

# 2. Link replacement (English)
dactyl_build --vars '{"do_link_replacement":true}' -q

# 3. Link replacement (Japanese)
dactyl_build -t ja -o out/ja --vars '{"do_link_replacement":true}' -q

# 4. Blank this snippet which contains a Jinja macro (not needed, throws errors)
truncate -s 0 content/_snippets/macros/page-children.md

# 5. Move Japanese snippets from _snippets/*.ja.md to @i18n/ja/_snippets/*.md
cd content/_snippets
find . -type d -exec sh -c 'mkdir -p "../@i18n/ja/_snippets/$0"' {} \;
find . -name "*.ja.md" -exec sh -c 'mv "$0" "../@i18n/ja/_snippets/${0%.ja.md}.md"' {} \;
cd ../..

# 6. Convert Dactyl syntax to Redocly syntax
tool/md_dactyl_to_redocly.py

# 7. Convert indented code blocks to (possibly-indented) code fences
node tool/convert-code-blocks.cjs content/

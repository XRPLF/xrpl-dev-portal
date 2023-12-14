#!/bin/bash

# Migrate links script. Requires a "working"(ish) Dactyl build, so it should be run before md_dactyl_to_redocly.py or convert-code-blocks.cjs

# Update the autosubs_cheatsheet.yml file based on the typical link includes.
tool/make_autosubs.sh

# Make a new "common links" snippet to replace the old ones.
tool/make_common_links_snippet.sh

# Re-generate the Redocly sidebar and redirects.yaml based on Dactyl pagelist.
dactyl_build --vars '{"do_redocly_sidebar":true}'

# Blank the snippets that contain reusable links, so the md reference links will remain unparsed as [Link text][]
truncate -s 0 content/_snippets/rippled-api-links.md
truncate -s 0 content/_snippets/tx-type-links.md
truncate -s 0 content/_snippets/rippled_versions.md

# Link replacement (English)
dactyl_build --vars '{"do_link_replacement":true}' -q

# Link replacement (Japanese)
dactyl_build -t ja -o out/ja --vars '{"do_link_replacement":true}' -q

# Blank this snippet which contains a Jinja macro (not needed, throws errors)
truncate -s 0 content/_snippets/macros/page-children.md

# Move Japanese snippets from _snippets/*.ja.md to @i18n/ja/_snippets/*.md
cd content/_snippets
find . -type d -exec sh -c 'mkdir -p "../@i18n/ja/_snippets/$0"' {} \;
find . -name "*.ja.md" -exec sh -c 'mv "$0" "../@i18n/ja/_snippets/${0%.ja.md}.md"' {} \;
cd ../..

# Convert Dactyl syntax to Redocly syntax
tool/md_dactyl_to_redocly.py

# Convert indented code blocks to (possibly-indented) code fences
node tool/convert-code-blocks.cjs content/

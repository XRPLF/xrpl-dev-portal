#!/bin/bash

# Migrate links script. Requires a "working"(ish) Dactyl build, so it should be run before md_dactyl_to_redocly.py or convert-code-blocks.cjs

# 1. Blank the snippets that contain reusable links, so the md reference links will remain unparsed as [Link text][]
truncate -s 0 content/_snippets/rippled-api-links.md
truncate -s 0 content/_snippets/tx-type-links.md
truncate -s 0 content/_snippets/rippled_versions.md

# 2. Link replacement (English)
dactyl_build --vars '{"do_link_replacement":true}'

# 3. Link replacement (Japanese)
dactyl_build -t ja -o out/ja --vars '{"do_link_replacement":true}'

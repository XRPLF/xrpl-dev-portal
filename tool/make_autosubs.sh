#!/bin/bash

echo '# Autosubs cheat sheet

{% include "_snippets/rippled-api-links.md" %}
{% include "_snippets/tx-type-links.md" %}
{% include "_snippets/rippled_versions.md" %}
' > content/autosubs_gen.md

dactyl_build --pages content/autosubs_gen.md --md -q
rm content/autosubs_gen.md

sed -i -r 's/\[|\]/"/g' out/autosubs_gen.md
sed -i -r 's/<!--.*-->//' out/autosubs_gen.md
#sed -i -r 's/ "BADGE_.*"//' out/autosubs_gen.md

cat out/autosubs_gen.md  | sort | uniq > tool/autosubs_cheatsheet.yml
sed -i -r 's/^\s+//' tool/autosubs_cheatsheet.yml
sed -i '/./,$!d' tool/autosubs_cheatsheet.yml

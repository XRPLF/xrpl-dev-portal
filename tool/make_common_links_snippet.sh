#!/bin/bash

echo '# Common links

{% include "_snippets/rippled-api-links.md" %}
{% include "_snippets/tx-type-links.md" %}
{% include "_snippets/rippled_versions.md" %}
' > content/common-links-gen.md

dactyl_build --pages content/common-links-gen.md --md -q
rm content/common-links-gen.md

#sed -i -r 's/\[|\]/"/g' out/autosubs_gen.md
sed -i 's/# Common links//' out/common-links-gen.md
sed -i -r 's/<!--.*-->//' out/common-links-gen.md
#sed -i -r 's/ "BADGE_.*"//' out/common-links-gen.md

cat out/common-links-gen.md  | sort | uniq > content/_snippets/common-links.md
sed -i -r 's/^\s+//' content/_snippets/common-links.md
sed -i '/./,$!d' content/_snippets/common-links.md

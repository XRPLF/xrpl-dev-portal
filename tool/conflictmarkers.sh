#!/bin/bash

PATTERNS=('<<<<<<<' '>>>>>>>')
#not including ====== because that can be used for markdown h1 syntax

n=0
for p in ${PATTERNS[@]}; do
    g=`grep -R $p content/* | grep -v '^Binary file .* matches$'`
    if [[ ! -z $g ]]; then
        echo "Git merge conflict marker $p found: $g"
        n=1
    fi
done
exit $n

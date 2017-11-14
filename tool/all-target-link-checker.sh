#!/bin/bash
mkdir -p out
## One-liner syntax doesn't handle exit codes properly...
#./build.sh -lq | awk '{print "rm -r out/ && ./build.sh -t "$1" && ./check-links.sh"}' | xargs -0 bash -c

targets=`dactyl_build -lq | awk '{print $1}'`
linkerrors=0
builderrors=0
while read -r line; do
    echo ""
    echo "======================================="
    echo "Checking Target: $line"
    rm -r out
    dactyl_build -sq -t "$line"
    buildresult=$?
    if [ $buildresult -eq 0 ]
    then
        dactyl_link_checker -q "$@"
        linkerrors=$(($? + $linkerrors))
    else
        builderrors=$(($buildresult + $builderrors))
        echo "Error building this target; skipping link checker."
    fi
done <<< "$targets"

totalerrors=$(($builderrors + $linkerrors))

echo ""
echo "======================================="
echo "======================================="
echo "All-target summary:"
echo "• $builderrors build errors"
echo "• $linkerrors link errors"
echo "-----------------------------"
echo "  $totalerrors total errors"
echo ""

exit $totalerrors

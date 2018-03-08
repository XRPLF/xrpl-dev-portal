#!/bin/bash
mkdir -p out

# Pass forward dactyl "vars" arg if provided
if [ "$1" == "--vars" ] && [ -n "$2" ];
then
  dactyl_vars=$2
  shift 2
fi

targets=`dactyl_build -lq | awk '{print $1}'`
linkerrors=0
builderrors=0
while read -r line; do
    echo ""
    echo "======================================="
    echo "Checking Target: $line"
    rm -r out
    if [ -n "$dactyl_vars" ]; then
      dactyl_build -q -t "$line" --vars "$dactyl_vars"
    else
      dactyl_build -q -t "$line"
    fi
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

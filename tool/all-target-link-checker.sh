#!/bin/bash
mkdir -p out
rm -r out

# Pass forward dactyl "vars" arg if provided
if [ "$1" == "--vars" ] && [ -n "$2" ];
then
  dactyl_vars=$2
  shift 2
fi

linkerrors=0
builderrors=0

# Build language-based targets all together first
langs=(en ja)
for lang in ${langs[*]}; do
  echo "======================================="
  echo "Building language: en"

  if [ "$lang" == "en" ]; then
    if [ -n "$dactyl_vars" ]; then
      dactyl_build -q -t "$lang" --vars "$dactyl_vars"
    else
      dactyl_build -q -t "$lang"
    fi
  else
    if [ -n "$dactyl_vars" ]; then
      dactyl_build -q -t "$lang" -o "out/$lang" --vars "$dactyl_vars"
    else
      dactyl_build -q -t "$lang" -o "out/$lang"
    fi
  fi
  buildresult=$?
  if [ $buildresult -ne 0 ]; then
    builderrors=$(($buildresult + $builderrors))
    echo "Error building this target; link checker may miss things."
  fi
done

# Check language targets all at once
dactyl_link_checker -q "$@"
linkerrors=$(($? + $linkerrors))

# Build & check other targets individually afterwords
other_targets=`dactyl_build -lq | awk '/^(en|ja) / {next;} {print $1}'`
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
done <<< "$other_targets"

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

#!/bin/bash

## Run from the root directory of the repo to build all languages
## TODO: read the `-o` / `--out` argument and adapt it for non-en languages

dactyl_build --vars "$dactyl_vars"
dactyl_build -t ja -o out/ja --vars "$dactyl_vars"

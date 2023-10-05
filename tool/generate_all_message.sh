#!/bin/bash

## Run from the root directory of the repo to generate & compile all messages

TZ="UTC" pybabel extract -F ./locale/babel.cfg -o ./locale/messages.pot ./

pybabel update -l ja -d ./locale/ -i ./locale/messages.pot 

pybabel compile -f -d ./locale/

#!/bin/bash

# meant to be run from the root directory of the repo

set -e

tool/conflictmarkers.sh
tool/all-target-link-checker.sh

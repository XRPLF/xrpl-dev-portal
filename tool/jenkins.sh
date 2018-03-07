#!/bin/bash

# meant to be run from the root directory of the repo

## Test: show pull request data in build results
echo "ghprbAuthorRepoGitUrl is: " ${ghprbAuthorRepoGitUrl}
echo "ghprbSourceBranch is: " ${ghprbSourceBranch}
echo "ghprbPullId is: " ${ghprbPullId}

set -e

tool/conflictmarkers.sh
tool/all-target-link-checker.sh

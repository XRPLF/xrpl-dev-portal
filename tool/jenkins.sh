#!/bin/bash

# meant to be run from the root directory of the repo

## Test: show pull request data in build results
echo "ghprbAuthorRepoGitUrl is: " ${ghprbAuthorRepoGitUrl}
echo "ghprbSourceBranch is: " ${ghprbSourceBranch}
echo "ghprbPullId is: " ${ghprbPullId}

gitForkWithoutSuffix=${ghprbAuthorRepoGitUrl%.git}

if [ -n "$ghprbPullId" ];
then
  dactyl_vars='--vars '"'"'{"github_forkurl": "'"$gitForkWithoutSuffix"'", "github_branch": "'"$ghprbSourceBranch"'", "github_pr_id": "'"$ghprbPullId"'"}'"'"
else
  dactyl_vars=""
fi

set -e

tool/conflictmarkers.sh
tool/all-target-link-checker.sh "$dactyl_vars"

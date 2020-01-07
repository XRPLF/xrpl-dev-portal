#!/bin/bash

# meant to be run from the root directory of the repo

## Show pull request data in build results
echo "ghprbAuthorRepoGitUrl is: " ${ghprbAuthorRepoGitUrl}
echo "ghprbSourceBranch is: " ${ghprbSourceBranch}
echo "ghprbPullId is: " ${ghprbPullId}

gitForkWithoutSuffix=${ghprbAuthorRepoGitUrl%.git}

if [ -n "$ghprbPullId" ];
then
  echo '{"github_forkurl": "'"$gitForkWithoutSuffix"'", "github_branch": "'"$ghprbSourceBranch"'", "github_pr_id": "'"$ghprbPullId"'", "is_pr_build": true}' > pr_vars.json
  dactyl_vars="pr_vars.json"
else
  dactyl_vars=""
fi

set -e

tool/conflictmarkers.sh

## Remove output directory if it exists (so the build is clean)
rm -rf out
## Build all languages, then run the link checker once
tool/build_all_langs.sh --vars "$dactyl_vars"
dactyl_link_checker -q

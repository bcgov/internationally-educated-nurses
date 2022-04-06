#!/bin/bash

MAIN_HEAD=$(git ls-remote origin refs/heads/main | cut -f 1)
MERGE_BASE=$(git merge-base origin refs/heads/main $(git rev-parse --abbrev-ref HEAD))

echo $MAIN_HEAD
echo $MERGE_BASE

if [ $MAIN_HEAD == $MERGE_BASE ]; then
    echo "All Good!"
else
    echo "Rebase before tagging!"
    echo "git pull origin main --rebase"
fi

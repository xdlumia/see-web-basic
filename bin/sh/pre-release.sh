#!/usr/bin/env sh
git checkout dev

if test -n "$(git status --porcelain)"; then
  echo -e '\E[1;31mRelease Error: Unclean working tree. Commit or stash changes first.\E[0m' >&2;
  exit 128;
fi

if ! git fetch --quiet 2>/dev/null; then
  echo -e '\E[1;31mRelease Error:  There was a problem fetching your branch. Run `git fetch` to see more...\E[0m' >&2;
  exit 128;
fi

if test "0" != "$(git rev-list --count --left-only @'{u}'...HEAD)"; then
  echo -e '\E[1;31mRelease Error:  Remote history differ. Please pull changes.\E[0m' >&2;
  exit 128;
fi

echo 'No conflicts.' >&2;

git checkout master
git pull
git merge dev

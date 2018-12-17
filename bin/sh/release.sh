#!/usr/bin/env sh
set -e
VERSION=$1
IS_RELEASE=$2

if [[ $IS_RELEASE = true ]]
then
  echo "git Releasing $VERSION ..."
  # commit version
  git add -A
  git commit -m "[auto-build] $VERSION"
  git push origin master

  # publish
  git tag v$VERSION
  git push origin master --tags

  git checkout dev
  git rebase master
  git push origin dev

  echo "npm publish $VERSION ..."
  npm publish
else
  echo "npm publish $VERSION ..."
  npm publish --tag beta
fi

echo -e "\E[1;32mPublish success! Current Version is  $VERSION.\E[0m"

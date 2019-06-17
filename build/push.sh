#!/bin/sh

if [[ $TRAVIS_BRANCH != master ]]; then
  msg "Not pushing updates to branch $TRAVIS_BRANCH"
  return 0
fi
git clone https://github.com/ZippyMagician/Pixel-Docs
git config --global user.email "$GH_EMAIL"
git config --global user.name "$GH_USERNAME"
git config --global push.default current
git stash
git checkout ${TRAVIS_BRANCH}
git stash pop
grunt release
git push https://${GH_TOKEN}@github.com/ZippyMagician/Pixel-Docs.git

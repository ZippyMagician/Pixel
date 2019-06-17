#!/bin/sh
# Adapted from https://gist.github.com/willprice/e07efd73fb7f13f917ea

setup_git() {
  git config --global user.email "$GH_EMAIL"
  git config --global user.name "$GH_USERNAME"
}

upload_files() {
  dateAndMonth=`date "+%b %Y"`

  cd docs
  git init

  git checkout master
  
  git remote add docs https://ZippyMagician:${GH_TOKEN}@github.com/ZippyMagician/Pixel-Docs.git # > /dev/null 2>&1
  git add .
  git commit -m "Travis update: $dateAndMonth (Build $TRAVIS_BUILD_NUMBER)" -m "[skip ci]"
  git pull docs master --allow-unrelated-histories --rebase

  git push docs master
}

if [[ "$TRAVIS_BRANCH" != master ]]; then
  echo -e "\e[36m\e[1mTest triggered for branch \"${TRAVIS_BRANCH}\" - doing nothing."
  exit 0
fi

setup_git

echo "Uploading to GitHub"
upload_files

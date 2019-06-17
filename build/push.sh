#!/bin/sh
# Adapted from https://gist.github.com/willprice/e07efd73fb7f13f917ea

setup_git() {
  git config --global user.email "$GH_EMAIL"
  git config --global user.name "$GH_USERNAME"
}

commit_country_json_files() {
  git checkout master
  
  dateAndMonth=`date "+%b %Y"`
  
  git add -f dist/output/*.json
  
  git commit -m "Travis update: $dateAndMonth (Build $TRAVIS_BUILD_NUMBER)" -m "[skip ci]"
}

upload_files() {
  git remote rm origin
  
  git remote add origin https://vinaygopinath:${GH_TOKEN}@github.com/ZippyMagician/Pixel-Docs > /dev/null 2>&1
  git push origin master --quiet
}

if [[ "$TRAVIS_BRANCH" != master ]]; then
  echo -e "\e[36m\e[1mTest triggered for branch \"${TRAVIS_BRANCH}\" - doing nothing."
  exit 0
fi

setup_git

commit_country_json_files

if [ $? -eq 0 ]; then
  echo "A new commit with changed country JSON files exists. Uploading to GitHub"
  upload_files
else
  echo "No changes in country JSON files. Nothing to do"
fi

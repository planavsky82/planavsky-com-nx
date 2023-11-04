#!/usr/bin/env sh

# run e2e and a11y tests
npx playwright install
npm run test:e2e

# run unit tests
npm run test:planit

# deploy docs site
npm run build:planit-docs
cd dist/apps/planit-docs/www
rm -rf .git
git init
git remote add origin git@github.com:planavsky82/component-lib-platform-intro.git
git fetch --all
git branch -d gh-pages
git add -A
git commit -m 'update gh-pages'
git checkout -b gh-pages
git push --set-upstream origin gh-pages -f
cd ../../../../

# build planit lib
npm run build:planit:prod

# build planit storybook
npm run build:planit-storybook

# deploy storybook via Firebase
firebase deploy --only hosting:planit-web-components

# copy react and angular wrappers to planit dist
mv ./dist/libs/planit-react ./dist/libs/planit
mv ./dist/libs/planit-angular ./dist/libs/planit

# deploy npm version of library
cd dist/libs/planit
cp package.json package-tmp.json

node ../../../scripts/edit-package-json.js

git add -A
git commit -m 'chore(release): create temporary package.json'

echo 'Deployment Started ...'
npm version $1

echo 'Publishing NPM Package ...'
npm publish

echo 'Adding GIT Commit ...'
rm -rf package-tmp.json
git add -A
git commit -m "chore(release): $1"
git push
cd ../../../

echo 'Deployment Complete.'

# deploy server hosted planit library
firebase deploy --only hosting:planit-lib

# deploy React demo

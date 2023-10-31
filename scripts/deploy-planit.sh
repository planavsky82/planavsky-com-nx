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

# deploy storybook via Firebase

# copy react and angular wrappers to planit dist

# deploy npm version of library

# deploy server hosted planit library

# deploy React demo

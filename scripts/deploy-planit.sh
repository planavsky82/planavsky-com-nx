#!/usr/bin/env sh

# run e2e and a11y tests
npx playwright install
npm run test:e2e
npm run test:planit

# run unit tests

# deploy docs site

# deploy storybook via Firebase

# copy react and angular wrappers to planit dist

# deploy server hosted planit library

# deploy React demo

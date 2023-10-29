#!/usr/bin/env sh

# run e2e and a11y tests
npx playwright install
npm run test:e2e

# run unit tests
npm run test:planit

# deploy docs site

# deploy storybook via Firebase

# copy react and angular wrappers to planit dist

# deploy server hosted planit library

# deploy React demo

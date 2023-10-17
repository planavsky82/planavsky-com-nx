#!/usr/bin/env sh

cd functions && npm ci && cd ..
nx build angular-app
firebase deploy


# cd angular
# npm run e2e:mffr:clean
# npm run build:mffr
# cd ..
# cd blog
# npm run build
# cd ..
# rm -rf dist
# mkdir -p dist
# cd angular
# mv dist/mffr ../dist
# cd ../dist
# mkdir -p web-components
# cd ../stencil-web-components
# npm run build
# mv dist ../dist/web-components
# cd ../dist/mffr
# mkdir -p web-components
# cd ../../stencil-web-components
# npm run build
# mv dist ../dist/mffr/web-components
# cd ../dist
# mkdir -p blog
# cd ../blog
# mv public ../dist/blog
# firebase deploy

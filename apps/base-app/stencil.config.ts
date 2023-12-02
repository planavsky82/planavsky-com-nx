import { Config } from '@stencil/core';
import tailwind, { tailwindHMR } from 'stencil-tailwind-plugin';

import { sass } from '@stencil/sass';
// https://stenciljs.com/docs/config

export const config: Config = {
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.scss',
  taskQueue: 'async',
  sourceMap: true,

  outputTargets: [
    {
      type: 'www',
      serviceWorker: {
        swSrc: 'src/sw.js',
        globPatterns: [
          '**/*.{js,css,json,html,ico,png}'
        ],
        swDest: '../../../dist/apps/base-app/www/service-worker.js'
      }
    },
  ],
  extras: {
    experimentalImportInjection: true,
  },
  plugins: [sass(), tailwind(), tailwindHMR()],
};

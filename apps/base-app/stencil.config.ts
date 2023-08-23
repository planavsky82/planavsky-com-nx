import { Config } from '@stencil/core';

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
      serviceWorker: null,
    },
  ],
  extras: {
    experimentalImportInjection: true,
  },
  plugins: [sass()],
};

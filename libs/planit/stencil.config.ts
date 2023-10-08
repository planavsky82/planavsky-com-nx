import { Config } from '@stencil/core';

const angularValueAccessorBindings: ValueAccessorConfig[] = [];

import {
  angularOutputTarget,
  ValueAccessorConfig,
} from '@stencil/angular-output-target';

import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'planit',
  taskQueue: 'async',
  sourceMap: true,

  extras: {
    experimentalImportInjection: true,
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    {
      type: 'dist-hydrate-script',
      dir: 'dist/hydrate',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      includeGlobalScripts: false,
    },

    angularOutputTarget({
      componentCorePackage: '@planit/angular-wrappers',
      directivesProxyFile:
        '../../../dist/libs/planit-angular/src/generated/directives/proxies.ts',
      directivesArrayFile:
        '../../../dist/libs/planit-angular/src/generated/directives/index.ts',
      valueAccessorConfigs: angularValueAccessorBindings,
    }),

    reactOutputTarget({
      componentCorePackage: '@planit/react-wrappers',
      proxiesFile: '../../../dist/libs/planit-react/src/generated/components.ts',
      includeDefineCustomElements: true,
    }),
  ],
};

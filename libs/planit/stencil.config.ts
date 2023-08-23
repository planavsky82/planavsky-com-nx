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
      autoDefineCustomElements: true,
      includeGlobalScripts: false,
    },

    angularOutputTarget({
      componentCorePackage: '@undefined/planit',
      directivesProxyFile:
        '../../../libs/planit-angular/src/generated/directives/proxies.ts',
      directivesArrayFile:
        '../../../libs/planit-angular/src/generated/directives/index.ts',
      valueAccessorConfigs: angularValueAccessorBindings,
    }),

    reactOutputTarget({
      componentCorePackage: '@undefined/planit',
      proxiesFile: '../../../libs/planit-react/src/generated/components.ts',
      includeDefineCustomElements: true,
    }),
  ],
};

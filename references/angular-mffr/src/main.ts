import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { applyPolyfills, defineCustomElements } from '@planit/components/loader';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

applyPolyfills().then(() => {
  defineCustomElements();
});

/* let onDeviceReady = () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
};
document.addEventListener('deviceready', onDeviceReady, false); */

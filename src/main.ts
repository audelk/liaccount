// Third party JS imports
// Page loader
import './vendor/pace/pace.min.js';
// // User tour
// import '../node_modules/hopscotch/dist/js/hopscotch.min.js';
// // Charts
// import './vendor/Chart.min.js';
// // Rich Text Editor
// import '../node_modules/quill/dist/quill.min.js';

import '../node_modules/hammerjs/hammer.js';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
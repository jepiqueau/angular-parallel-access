import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import { Capacitor } from '@capacitor/core';

if (environment.production) {
  enableProdMode();
}
jeepSqlite(window);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

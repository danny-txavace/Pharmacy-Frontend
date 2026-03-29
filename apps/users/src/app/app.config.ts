import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { appRoutes } from './app.routes';

import { I18nRouterTitleRepository } from '@frontend-pharmacy/core/lib/repositories/i18n-router-title-repository';

// PrimeNG
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura'; //aura, lara, nora, material

// ngx-translate
// npm install @ngx-translate/core @ngx-translate/http-loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';

export function createTranslateLoader() {
  return new TranslateHttpLoader();
}

export const appConfig: ApplicationConfig = {
  providers:
  [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(
      withFetch()
      /*withInterceptors([
        credentialsInterceptor,
        authInterceptor,
        apiErrorInterceptor,
        msgErrorInterceptor
      ])*/
    ),
    {
      provide: TitleStrategy,
      useClass: I18nRouterTitleRepository
    },
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: false,
          cssLayer: false
        }
      },
      ripple: true,
      zIndex: {
        modal: 1100,    // dialog, sidebar
        overlay: 1200,  // dropdown, overlaypanel
        menu: 1000,     // overlay menus
        tooltip: 1100   // tooltip
      }
    }),
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: './assets/i18n/',
        suffix: '.json'
      }
    },
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }).providers || []
  ],
};

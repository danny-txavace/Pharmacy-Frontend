import { Injectable, inject, ApplicationRef, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class I18nRepository {
  private readonly storageKey = 'i18n';
  private readonly supportedLangs = ['en', 'es', 'fr', 'it', 'pt', 'zh', 'mkh', 'xig', 'seh'];

  private currentLangSubject = new BehaviorSubject<string>(this.getLang());
  currentLang$ = this.currentLangSubject.asObservable();

  // Injector será usado para injeção lazy
  private readonly injector = inject(Injector);

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    const savedLang = this.getLang();

    const defaultLang =
      savedLang && this.supportedLangs.includes(savedLang)
        ? savedLang
        : this.getBrowserLang();

    this.useLang(defaultLang);
  }

  toggleLang(): void {
    const current = this.getLang();
    const currentIndex = this.supportedLangs.indexOf(current);
    const nextIndex = (currentIndex + 1) % this.supportedLangs.length;
    const nextLang = this.supportedLangs[nextIndex];
    this.useLang(nextLang);
  }

  setLang(lang: string): void {
    if (this.supportedLangs.includes(lang)) {
      this.useLang(lang);
    } else {
      console.warn(`Language unavailable: ${lang}`);
    }
  }

  getLang(): string {
    return localStorage.getItem(this.storageKey) || 'mz';
  }

  private getBrowserLang(): string {
    const browserLang = navigator.language.split('-')[0];
    return this.supportedLangs.includes(browserLang) ? browserLang : 'mz';
  }

  private useLang(lang: string): void {
    // Lazy injection: evita dependência circular
    const translateService = this.injector.get(TranslateService);
    const appRef = this.injector.get(ApplicationRef);

    // Força recarregar JSON mesmo que já tenha sido carregado
    translateService.reloadLang(lang).subscribe(() => {
      translateService.use(lang).subscribe(() => {
        localStorage.setItem(this.storageKey, lang);
        this.currentLangSubject.next(lang);
        appRef.tick(); // garante atualização da view mesmo com OnPush
      });
    });
  }
}

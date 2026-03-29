import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeRepository implements OnDestroy {

  private readonly storageKey = 'theme';

  private themeSubject = new BehaviorSubject<string>(this.getStoredTheme());
  theme$ = this.themeSubject.asObservable();

  private mediaQuery?: MediaQueryList;

  //private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private mediaQueryListener?: (event: MediaQueryListEvent) => void;

  constructor() {
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    }
    this.initialize();
  }

  private initialize(): void {
    const savedTheme = localStorage.getItem(this.storageKey);

    if (savedTheme) {
      this.applyTheme(savedTheme, false);
    } else {
      this.applyTheme(this.getSystemTheme(), true);
    }

    this.setupSystemThemeListener();
  }

  private getSystemTheme(): string {
    if (!this.mediaQuery) {
      return 'light'; // fallback padrão para SSR
    }

    return this.mediaQuery.matches ? 'dark' : 'light';
  }

  private setupSystemThemeListener(): void {
    if (!this.mediaQuery) return;

    this.mediaQueryListener = (event: MediaQueryListEvent) => {
      if (!localStorage.getItem(this.storageKey)) {
        const newTheme = event.matches ? 'dark' : 'light';
        this.applyTheme(newTheme, false);
        this.themeSubject.next(newTheme);
      }
    };

    this.mediaQuery.addEventListener('change', this.mediaQueryListener);
  }

  toggleTheme(): void {
    const newTheme = this.getStoredTheme() === 'light' ? 'dark' : 'light';
    this.setStoredTheme(newTheme);
  }

  getStoredTheme(): string {
    return localStorage.getItem(this.storageKey) || this.getSystemTheme();
  }

  setStoredTheme(theme: string): void {
    this.applyTheme(theme, true);
    this.themeSubject.next(theme);
  }

  private applyTheme(theme: string, updateStorage: boolean): void {

    this.updatePrimengTheme(theme);
    this.updateTailwindTheme(theme);

    document.documentElement.classList.remove('light', 'dark');
    document.body.classList.remove('light', 'dark');

    document.documentElement.classList.add(theme);
    document.body.classList.add(theme);

    if (updateStorage) {
      localStorage.setItem(this.storageKey, theme);
    }
  }

  private updatePrimengTheme(theme: string): void {

    const themeHref =
      theme === 'dark'
        ? '/assets/themes/dark-mode.scss'
        : '/assets/themes/light-mode.scss';

    let link = document.getElementById('primeng-theme') as HTMLLinkElement;

    if (!link) {
      link = document.createElement('link');
      link.id = 'primeng-theme';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    link.href = themeHref;
  }

  private updateTailwindTheme(theme: string): void {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

  ngOnDestroy(): void {
    if (this.mediaQuery && this.mediaQueryListener) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
  }
}

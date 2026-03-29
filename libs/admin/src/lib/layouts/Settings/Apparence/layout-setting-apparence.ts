import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, UrlSegment } from '@angular/router';
import { I18nRepository } from '@frontend-pharmacy/core/lib/repositories/i18n-repository';
import { ThemeRepository } from '@frontend-pharmacy/core/lib/repositories/theme-repository';
import { TranslateModule } from '@ngx-translate/core';
import { RippleModule } from 'primeng/ripple';
import { distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'lib-layout-setting-apparence',
  imports: [RippleModule, CommonModule, TranslateModule],
  templateUrl: './layout-setting-apparence.html',
  styleUrl: './layout-setting-apparence.scss',
})
export class LayoutSettingApparence implements OnInit, OnDestroy {
  private readonly themeRep = inject(ThemeRepository);
  private readonly i18nRep = inject(I18nRepository);
  private readonly router = inject(Router);

  private readonly subs = new Subscription();

  protected isDark = false;
  protected isLight = false;

  protected isCN = false;
  protected isES = false;
  protected isFR = false;
  protected isGB = false;
  protected isIT = false;
  protected isMZ = false;

  protected isMKH = false;
  protected isXIG = false;
  protected isSEH = false;

  ngOnInit(): void {
    if (this.themeRep.getStoredTheme() === 'dark')
    {
      this.toggleBtn('dark');
    } else if (this.themeRep.getStoredTheme() === 'light')
    {
      this.toggleBtn('light');
    }

    this.subs.add(
      this.i18nRep.currentLang$.pipe(
        distinctUntilChanged()
      ).subscribe(value => {
        this.toggleBtn(value);

        const newLang = value;
        const tree = this.router.parseUrl(this.router.url);
        tree.root.children['primary'].segments[0] = new UrlSegment(newLang, {});
        this.router.navigateByUrl(tree, { replaceUrl: true });
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subs) { this.subs.unsubscribe(); }
  }

  protected toggleBtn(format: string): void {
    switch(format) {
      case 'dark':
        this.isDark = true;
        this.isLight = false;

        this.themeRep.setStoredTheme(format);
        break;
      case 'light':
        this.isDark = false;
        this.isLight = true;

        this.themeRep.setStoredTheme(format);
        break;
      case 'zh':
        this.isCN = true;
        this.isES = false;
        this.isFR = false;
        this.isGB = false;
        this.isIT = false;
        this.isMZ = false;

        this.isMKH = false;
        this.isXIG = false;
        this.isSEH = false;

        this.i18nRep.setLang(format);
        break;
      case 'es':
        this.isCN = false;
        this.isES = true;
        this.isFR = false;
        this.isGB = false;
        this.isIT = false;
        this.isMZ = false;

        this.isMKH = false;
        this.isXIG = false;
        this.isSEH = false;

        this.i18nRep.setLang(format);
        break;
      case 'fr':
        this.isCN = false;
        this.isES = false;
        this.isFR = true;
        this.isGB = false;
        this.isIT = false;
        this.isMZ = false;

        this.isMKH = false;
        this.isXIG = false;
        this.isSEH = false;

        this.i18nRep.setLang(format);
        break;
      case 'en':
        this.isCN = false;
        this.isES = false;
        this.isFR = false;
        this.isGB = true;
        this.isIT = false;
        this.isMZ = false;

        this.isMKH = false;
        this.isXIG = false;
        this.isSEH = false;

        this.i18nRep.setLang(format);
        break;
      case 'it':
        this.isCN = false;
        this.isES = false;
        this.isFR = false;
        this.isGB = false;
        this.isIT = true;
        this.isMZ = false;

        this.isMKH = false;
        this.isXIG = false;
        this.isSEH = false;

        this.i18nRep.setLang(format);
        break;
      case 'pt':
        this.isCN = false;
        this.isES = false;
        this.isFR = false;
        this.isGB = false;
        this.isIT = false;
        this.isMZ = true;

        this.isMKH = false;
        this.isXIG = false;
        this.isSEH = false;

        this.i18nRep.setLang(format);
        break;
      case 'mkh':
        this.isCN = false;
        this.isES = false;
        this.isFR = false;
        this.isGB = false;
        this.isIT = false;
        this.isMZ = false;

        this.isMKH = true;
        this.isXIG = false;
        this.isSEH = false;

        this.i18nRep.setLang(format);
        break;
      case 'xig':
        this.isCN = false;
        this.isES = false;
        this.isFR = false;
        this.isGB = false;
        this.isIT = false;
        this.isMZ = false;

        this.isMKH = false;
        this.isXIG = true;
        this.isSEH = false;

        this.i18nRep.setLang(format);
        break;
      case 'seh':
        this.isCN = false;
        this.isES = false;
        this.isFR = false;
        this.isGB = false;
        this.isIT = false;
        this.isMZ = false;

        this.isMKH = false;
        this.isXIG = false;
        this.isSEH = true;

        this.i18nRep.setLang(format);
        break;
    }
  }
}

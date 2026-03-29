import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { I18nRepository } from '@frontend-pharmacy/core/lib/repositories/i18n-repository';
import { ThemeRepository } from '@frontend-pharmacy/core/lib/repositories/theme-repository';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly i18nRep = inject(I18nRepository);
  private readonly themeRepository = inject(ThemeRepository);
  private readonly translateService = inject(TranslateService);
  private readonly primeNG = inject(PrimeNG);
  private readonly subs = new Subscription();

  ngOnInit(): void {
    const home = `/${this.i18nRep.getLang()}`;
    this.router.navigateByUrl(home, { replaceUrl: true });

    const theme = this.themeRepository.getStoredTheme();
    document.body.classList.add(theme);

    this.subs.add(
      this.themeRepository.theme$.subscribe(t => {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(t);
      })
    );

    this.subs.add(
      this.translateService.onLangChange.subscribe(() => {
        this.primeNG.setTranslation({
          today: "COMMON.CALENDAR.TODAY",
          clear: "COMMON.CALENDAR.CLEAR",
          dateFormat: "COMMON.CALENDAR.DATE_FORMAT",
          weekHeader: "COMMON.CALENDAT.WEEK_HEADER",
          firstDayOfWeek: 1,
          dayNames: [
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.FULL.SUNDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.FULL.MONDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.FULL.TUESDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.FULL.WEDNESDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.FULL.THURSDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.FULL.FRIDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.FULL.SATURDAY')
          ],
          dayNamesShort: [
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.SHORT.SUNDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.SHORT.MONDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.SHORT.TUESDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.SHORT.WEDNESDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.SHORT.THURSDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.SHORT.FRIDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.SHORT.SATURDAY')
          ],
          dayNamesMin: [
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.MIN.SUNDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.MIN.MONDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.MIN.TUESDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.MIN.WEDNESDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.MIN.THURSDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.MIN.FRIDAY'),
            this.translateService.instant('COMMON.CALENDAR.DAY_NAMES.MIN.SATURDAY')
          ],
          monthNames: [
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.FULL.JANUARY'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.FULL.FEBRUARY'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.FULL.MARCH'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.FULL.APRIL'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.FULL.MAY'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.FULL.JUNE'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.FULL.JULY'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.FULL.AUGUST'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.FULL.SEPTEMBER'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.FULL.OCTOBER'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.FULL.NOVEMBER'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.FULL.DECEMBER')
          ],
          monthNamesShort: [
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.SHORT.JANUARY'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.SHORT.FEBRUARY'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.SHORT.MARCH'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.SHORT.APRIL'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.SHORT.MAY'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.SHORT.JUNE'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.SHORT.JULY'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.SHORT.AUGUST'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.SHORT.SEPTEMBER'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.SHORT.OCTOBER'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.SHORT.NOVEMBER'),
            this.translateService.instant('COMMON.CALENDAR.MONTH_NAMES.SHORT.DECEMBER')
          ]
        });
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }
}

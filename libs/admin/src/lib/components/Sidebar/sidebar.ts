import { Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { ImageModule } from 'primeng/image';
import { TranslateModule } from '@ngx-translate/core';
import { BreadCrumbRepository } from '@frontend-pharmacy/core/lib/repositories/bread-crumb-repository';
import { I18nRepository } from '@frontend-pharmacy/core/lib/repositories/i18n-repository';
import { NotificationHubService } from '@frontend-pharmacy/core/lib/services/notification-hub.service';
import { AuthService } from '@frontend-pharmacy/core/lib/services/auth.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'lib-sidebar',
  imports: [RouterModule, RippleModule, DividerModule, BadgeModule, CommonModule, ImageModule, TranslateModule, TooltipModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit, OnDestroy {
  @Input() isCollapsed = false;

  //protected readonly logoUrl = signal<string>('/assets/images/logo_etc.svg');
  protected readonly logoUrl = signal<string>('');

  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationHubService);
  private readonly breadCrumbRep = inject(BreadCrumbRepository);
  private readonly router = inject(Router);
  private readonly i18nRep = inject(I18nRepository);
  protected lang = signal<string>('');

  private readonly subs = new Subscription();

  protected isOpenFinancial = false;
  protected isActiveFinancial = false;

  protected isOpenPeople = false;
  protected isActivePeople = false;

  protected isActiveSetting = false;

  ngOnInit(): void {
    this.subs.add(
      this.i18nRep.currentLang$.subscribe(newLang => {
        this.lang.set(newLang);
      })
    );

    const currentUrl = this.router.url;
    this.isRouter(currentUrl);

    this.subs.add(
      this.router.events
        .pipe(filter((event) =>
        event instanceof NavigationEnd))
        .subscribe(() => {
          const currentUrl = this.router.url;

          this.isRouter(currentUrl);
        })
    );
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }

  protected toggleBtn(format: string): void
  {
    switch (format)
    {
      case 'financial':
        this.isOpenFinancial = !this.isOpenFinancial;
        break;
      case 'people':
        this.isOpenPeople = !this.isOpenPeople;
        break;
    }
  }

  private isRouter(currentUrl: string): void
  {
    if (
      (currentUrl === `/${this.lang()}/admin/financial-acc_payable`) ||
      (currentUrl === `/${this.lang()}/admin/financial-acc_receivable`) ||
      (currentUrl === `/${this.lang()}/admin/financial-acc_balance`) ||
      (currentUrl === `/${this.lang()}/admin/financial-cash_flow`) ||
      (currentUrl === `/${this.lang()}/admin/financial-receipts`) ||
      (currentUrl === `/${this.lang()}/admin/financial-reports`)
    )
    {
      this.isActiveFinancial = true;
    }
    else
    {
      this.isActiveFinancial = false;
    }

    if (
      (currentUrl === `/${this.lang()}/admin/people-customers`) ||
      (currentUrl === `/${this.lang()}/admin/people-suppliers`) ||
      (currentUrl === `/${this.lang()}/admin/people-users`)
    )
    {
      this.isActivePeople = true;
    }
    else
    {
      this.isActivePeople = false;
    }

    if (
      (currentUrl === `/${this.lang()}/admin/settings/profile`) ||
      (currentUrl === `/${this.lang()}/admin/settings/notifications`) ||
      (currentUrl === `/${this.lang()}/admin/settings/security`) ||
      (currentUrl === `/${this.lang()}/admin/settings/apparence`) ||
      (currentUrl === `/${this.lang()}/admin/settings/payment_method`) ||
      (currentUrl === `/${this.lang()}/admin/settings/other`) ||
      (currentUrl === `/${this.lang()}/admin/settings/license`)
    )
    {
      this.isActiveSetting = true;
    }
    else
    {
      this.isActiveSetting = false;
    }
  }

  protected navigateTo (breadcrumbs: {is_button:boolean, icon?: string, label: string, url?:string[] }[])
  {
    this.breadCrumbRep.setBreadcrumbs(breadcrumbs);
  }

  protected onSignOut(): void
  {
    this.notificationService.disconnect();
    this.authService.signOut();
  }
}

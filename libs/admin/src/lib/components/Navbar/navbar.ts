import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { CommonModule, NgClass } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { Ripple } from 'primeng/ripple';
import { TranslateModule } from '@ngx-translate/core';
import { I18nRepository } from '@frontend-pharmacy/core/lib/repositories/i18n-repository';
import { BreadCrumb, BreadCrumbRepository } from '@frontend-pharmacy/core/lib/repositories/bread-crumb-repository';
import { AuthService } from '@frontend-pharmacy/core/lib/services/auth.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'lib-navbar',
  imports: [Toolbar, NgClass, OverlayBadgeModule, AvatarModule, CommonModule, Ripple, TranslateModule, TooltipModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit, OnDestroy {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly i18nRep = inject(I18nRepository);

  private readonly breadCrumbRep = inject(BreadCrumbRepository);
  protected breadcrumbs: BreadCrumb[] = [];

  @Input() isCollapsed = true;
  @Output() toggleCollapsed = new EventEmitter<void>();

  private subs = new Subscription();
  protected isFullScreen = signal<boolean>(false);
  protected fullName = signal('');

  ngOnInit(): void {
    this.subs.add(
      this.breadCrumbRep.breadcrumbs$.subscribe(b => {
        this.breadcrumbs = b;
      })
    );

    /*this.subs.add(
      this.authService.me().subscribe(value => {
        this.fullName.set(value.fullName);
      })
    );*/
    this.fullName.set('Ramadan');
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }

  protected toggleFullscreen() {
    if (!this.isFullScreen()) {
      // Entrar no fullscreen
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Erro ao entrar em fullscreen:", err);
      });
      this.isFullScreen.set(true);
    } else {
      // Sair do fullscreen
      document.exitFullscreen().catch(err => {
        console.error("Erro ao sair de fullscreen:", err);
      });
      this.isFullScreen.set(false);
    }
  }

  protected navigateTo (breadcrumbs: {is_button: boolean, icon: string, label: string, url?:string[] }[]) {
    this.breadCrumbRep.setBreadcrumbs(breadcrumbs);
  }

  protected goBackTo(label: string) {
    const lang = this.i18nRep.getLang();

    const current = this.breadCrumbRep.getBreadcrumbs();
    const target = current.find(b => b.label === label);

    if (target) {
      const index = current.findIndex(b => b.label === label);
      const updated = current.slice(0, index + 1);

      this.breadCrumbRep.setBreadcrumbs(updated);

      if (target.url) {
        const link = `${lang}/admin/${target.url}`;
        this.router.navigateByUrl(link);
      }
    }
  }
}

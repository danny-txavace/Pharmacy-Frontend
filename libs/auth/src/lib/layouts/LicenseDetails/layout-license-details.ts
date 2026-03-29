import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { I18nRepository } from '@frontend-pharmacy/core/lib/repositories/i18n-repository';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'lib-layout-license-details',
  imports: [RippleModule, DividerModule],
  templateUrl: './layout-license-details.html',
  styleUrl: './layout-license-details.scss',
})
export class LayoutLicenseDetails {
  private readonly i18nRep = inject(I18nRepository);
  private readonly router = inject(Router);

  onContinue(): void
  {
    const auth = `/${this.i18nRep.getLang()}/auth/license-device-code`;

    this.router.navigateByUrl(auth, { replaceUrl: true });
  }
}

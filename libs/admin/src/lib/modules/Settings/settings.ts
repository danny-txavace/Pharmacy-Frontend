import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadCrumbRepository } from '@frontend-pharmacy/core/lib/repositories/bread-crumb-repository';
import { TranslateModule } from '@ngx-translate/core';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'lib-settings',
  imports: [RippleModule, TranslateModule, RouterModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  private readonly breadCrumbRep = inject(BreadCrumbRepository);
  
  protected navigateTo (breadcrumbs: {is_button:boolean, icon?: string, label: string, url?:string[] }[])
  {
    this.breadCrumbRep.setBreadcrumbs(breadcrumbs);
  }
}

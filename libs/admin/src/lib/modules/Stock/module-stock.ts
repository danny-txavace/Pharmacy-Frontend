import { Component, inject } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TabsModule } from 'primeng/tabs';
import { BreadCrumbRepository } from '@frontend-pharmacy/core/lib/repositories/bread-crumb-repository';
import { LayoutStockStatistic } from "../../layouts/Stock/Statistic/layout-stock-statistic";
import { LayoutStockExpiration } from '../../layouts/Stock/Expiration/layout-stock-expiration';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-module-stock',
  imports: [TabsModule, RippleModule, TranslateModule, LayoutStockStatistic, LayoutStockExpiration],
  templateUrl: './module-stock.html',
  styleUrl: './module-stock.scss',
})
export class ModuleStock {
  private readonly breadCrumbRep = inject(BreadCrumbRepository);

  protected navigateTo (breadcrumbs: {is_button:boolean, icon?: string, label: string, url?:string[] }[])
  {
    this.breadCrumbRep.setBreadcrumbs(breadcrumbs);
  }
}

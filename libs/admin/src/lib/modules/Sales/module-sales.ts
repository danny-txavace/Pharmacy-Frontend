import { Component, inject } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TabsModule } from 'primeng/tabs';
import { BreadCrumbRepository } from '@frontend-pharmacy/core/lib/repositories/bread-crumb-repository';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutSalesOverview } from "../../layouts/Sales/Overview/layout-sales-overview";
import { LayoutSalesSuccess } from "../../layouts/Sales/Success/layout-sales-success";
import { LayoutSalesPending } from "../../layouts/Sales/Pending/layout-sales-pending";
import { LayoutSalesCancelled } from "../../layouts/Sales/Cancelled/layout-sales-cancelled";

@Component({
  selector: 'lib-module-sales',
  imports: [TabsModule, RippleModule, TranslateModule, LayoutSalesOverview, LayoutSalesSuccess, LayoutSalesPending, LayoutSalesCancelled],
  templateUrl: './module-sales.html',
  styleUrl: './module-sales.scss',
})
export class ModuleSales {
  private readonly breadCrumbRep = inject(BreadCrumbRepository);

  protected navigateTo (breadcrumbs: {is_button:boolean, icon?: string, label: string, url?:string[] }[])
  {
    this.breadCrumbRep.setBreadcrumbs(breadcrumbs);
  }
}

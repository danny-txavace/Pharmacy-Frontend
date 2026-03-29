import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Navbar } from "../../components/Navbar/navbar";
import { Sidebar } from "../../components/Sidebar/sidebar";
import { RouterModule } from '@angular/router';
import { BreadCrumbRepository } from '@frontend-pharmacy/core/lib/repositories/bread-crumb-repository';
import { Toast } from "primeng/toast";
import { AllDialogs } from "../../components/_dialogs/_AllDialogs/all-dialogs";
import { LayoutChartRepository } from '../../repositories/layout-chart-repository';

@Component({
  selector: 'lib-outlet',
  imports: [CommonModule, Navbar, Sidebar, RouterModule, Toast, AllDialogs],
  templateUrl: './outlet.html',
  styleUrl: './outlet.scss',
})
export class Outlet implements OnInit {
  private readonly layoutChartRep = inject(LayoutChartRepository);

  protected isCollapsed : boolean = sessionStorage.getItem('is_collapsed') === 'true' ? true : false;
  private readonly breadCrumbRep = inject(BreadCrumbRepository);

  ngOnInit(): void {
    sessionStorage.setItem('is_collapsed', `${this.isCollapsed}`);
    this.navigateTo([{ is_button: false, icon: 'pi-objects-column', label: 'ADMIN.SIDEBAR.DASHBOARD' }]);
  }

  protected toggleCollapsed(): void
  {
    this.isCollapsed = !this.isCollapsed;
    sessionStorage.setItem('is_collapsed', `${this.isCollapsed}`);

    setTimeout(() => this.layoutChartRep.emitResize(), 0);
  }

  private navigateTo (breadcrumbs: {is_button: boolean, icon?: string, label: string, url?:string[] }[])
  {
    this.breadCrumbRep.setBreadcrumbs(breadcrumbs);
  }
}

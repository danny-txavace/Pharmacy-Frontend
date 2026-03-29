import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IFinancialAccountsTblResponse } from '@frontend-pharmacy/core/lib/interfaces/i-financial-response';
import { ITableParams } from '@frontend-pharmacy/core/lib/interfaces/i-table-dto';
import { formatValue, formatDateNoTime } from '@frontend-pharmacy/core/utils/formattings';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, RowSelectionOptions, GridOptions, GridApi, AllCommunityModule, ModuleRegistry, GridReadyEvent } from 'ag-grid-community';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

ModuleRegistry.registerModules([ AllCommunityModule ]);

@Component({
  selector: 'lib-point-of-sales',
  imports: [RippleModule, DividerModule, FloatLabelModule, FormsModule, InputIconModule, IconFieldModule, ReactiveFormsModule, InputTextModule, AgGridAngular, PanelMenuModule, TranslateModule],
  templateUrl: './point-of-sales.html',
  styleUrl: './point-of-sales.scss',
})
export class PointOfSales implements OnInit, OnDestroy {
  private readonly translateService = inject(TranslateService);
  private subs = new Subscription();

  protected tableLoading = true;
  protected searchInput = '';
  protected columnDefs: ColDef[] = [];
  protected rowData: IFinancialAccountsTblResponse[] = [];
  protected filteredData: IFinancialAccountsTblResponse[] = [];
  protected headerHeight = 50;
  protected rowHeight = 50;

  protected rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true
  };

  protected gridOptions: GridOptions = {
    defaultColDef: {
      autoHeight: true,
      suppressMovable: true, // can't move
      editable: false,
      sortable: true,
      unSortIcon: false,
      filter: false,
      resizable: false,
      headerClass: 'ag_header'
    }
  };
  protected gridApi!: GridApi;

  protected items: MenuItem[] = [];

  ngOnInit(): void {
    this.tableData();
    this.menuItem();
    //this.loadingData('is_loading');
  }

  ngOnDestroy(): void {
    if (this.subs) { this.subs.unsubscribe() }
  }

  private menuItem(): void {
    this.items =
    [
      {
        label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.CASH_REGISTER.TITLE'),
        icon: 'pi pi-inbox',
        items: [
          {
            label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.CASH_REGISTER.CLOSE'),
            icon: 'pi pi-folder',
            command: () => {
              console.log('Hello friend!!')
            }
          },
          {
            label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.CASH_REGISTER.CASH_IN'),
            icon: 'pi pi-plus',
            command: () => {
              console.log('Hello friend!!')
            }
          },
          {
            label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.CASH_REGISTER.CASH_OUT'),
            icon: 'pi pi-minus',
            command: () => {
              console.log('Hello friend!!')
            }
          },
          {
            label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.CASH_REGISTER.RESUME'),
            icon: 'pi pi-receipt',
            command: () => {
              console.log('Hello friend!!')
            }
          }
        ]
      },
      {
        label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.CUSTOMER.TITLE'),
        icon: 'pi pi-user',
        items: [
          {
            label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.CUSTOMER.NEW'),
            icon: 'pi pi-user-plus',
            command: () => {
              console.log('Hello friend!!')
            }
          },
          {
            label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.CUSTOMER.SEARCH'),
            icon: 'pi pi-list',
            command: () => {
              console.log('Hello friend!!')
            }
          }
        ]
      },
      {
        label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.ITEMS.TITLE'),
        icon: 'pi pi-tags',
        items: [
          {
            label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.ITEMS.ADD_WAREHOUSE'),
            icon: 'pi pi-warehouse',
            command: () => {
              console.log('Hello friend!!')
            }
          },
          {
            label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.ITEMS.ADD_NOT_REGISTERED'),
            icon: 'pi pi-cart-plus',
            command: () => {
              console.log('Hello friend!!')
            }
          },
          {
            label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.ITEMS.SEARCH'),
            icon: 'pi pi-list',
            command: () => {
              console.log('Hello friend!!')
            }
          }
        ]
      },
      {
        label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.SALES.TITLE'),
        icon: 'pi pi-cart-arrow-down',
        items: [
          {
            label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.SALES.SUCCESS'),
            icon: 'pi pi-check-circle',
            command: () => {
              console.log('Hello friend!!')
            }
          },
          {
            label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.SALES.PENDING'),
            icon: 'pi pi-pause-circle',
            command: () => {
              console.log('Hello friend!!')
            }
          },
          {
            label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.SALES.CANCELLED'),
            icon: 'pi pi-times-circle',
            command: () => {
              console.log('Hello friend!!')
            }
          }
        ]
      },
      {
        label: this.translateService.instant('ADMIN.CENTRE.POS.LEFT.PANEL_MENU.PRINT_RECEIPT'),
        icon: 'pi pi-print',
        command: () => {
          console.log('Hello friend!!')
        }
      }
    ];
  }

  tableData() {
    this.gridOptions.overlayNoRowsTemplate = `<span style="padding: 10px; color: red; font-size: 12pt;">${this.translateService.instant('COMMON.TABLE.BODY.EMPTY_DATA')}</span>`;

    this.columnDefs =
    [
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.POS.RIGHT.TABLE.HEADER.QTY'),
        field: 'totalAmount', minWidth: 120, flex: 1,
        cellClass: 'ag_cell_end',
        cellRenderer: (params: ITableParams) => {
          return formatValue('', params.value);
        }
      },
      {
        headerName: this.translateService.instant('COMMON.TABLE.HEADER.DESIGNATION'),
        field: 'description', minWidth: 200, flex: 1, wrapText: true, autoHeight: true,
        cellClass: 'ag_cell_start'
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.POS.RIGHT.TABLE.HEADER.UNIT_PRICE'),
        field: 'totalAmount', minWidth: 120, flex: 1,
        cellClass: 'ag_cell_end',
        cellRenderer: (params: ITableParams) => {
          return formatValue('', params.value);
        }
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.POS.RIGHT.TABLE.HEADER.TOTAL'),
        field: 'totalAmount', minWidth: 120, flex: 1,
        cellClass: 'ag_cell_end',
        cellRenderer: (params: ITableParams) => {
          return formatValue('', params.value);
        }
      },
      {
        headerName: this.translateService.instant('COMMON.TABLE.HEADER.ACTION'),
        minWidth: 140,
        flex: 1,
        cellClass: 'ag_cell_center',
        cellRendererSelector: (params) => {
          if (params.node.rowPinned === 'bottom') {
            return {
              component: null,
              params: null
            };
          }

          return {
            //component: TableBtnFinancialAccPayable,
            //params: { ...params }
          };
        }
      }
    ];
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onSearch()
  {
    this.searchInput.toLowerCase();
  }
}

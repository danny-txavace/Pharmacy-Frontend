import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IFinancialReceipts } from '@frontend-pharmacy/core/lib/interfaces/i-financial-response';
import { ITableParams } from '@frontend-pharmacy/core/lib/interfaces/i-table-dto';
import { formatValue } from '@frontend-pharmacy/core/utils/formattings';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent, ModuleRegistry, RowSelectionOptions } from 'ag-grid-community';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

ModuleRegistry.registerModules([ AllCommunityModule ]);

@Component({
  selector: 'lib-layout-stock-statistic',
  imports: [RippleModule, FloatLabelModule, FormsModule, AgGridAngular, InputIconModule, IconFieldModule, ReactiveFormsModule, InputTextModule, TranslateModule],
  templateUrl: './layout-stock-statistic.html',
  styleUrl: './layout-stock-statistic.scss',
})
export class LayoutStockStatistic implements OnInit, OnDestroy {
  private readonly translateService = inject(TranslateService);

  private readonly cdr = inject(ChangeDetectorRef);
  private subs = new Subscription();

  protected tableLoading = true;

  protected searchInput = '';
  protected columnDefs: (ColDef | ColGroupDef)[] = [];
  protected rowData: IFinancialReceipts[] = [];
  protected filteredData: IFinancialReceipts[] = [];

  protected headerHeight = 50;
  protected rowHeight = 50;

  protected rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true
  };

  protected gridOptions: GridOptions = {
    defaultColDef: {
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

  ngOnInit(): void {
    this.tableData();
    this.loadingData('is_loading');
  }

  ngOnDestroy(): void {
    if (this.subs) { this.subs.unsubscribe() }
  }

  tableData() {
    this.gridOptions.overlayNoRowsTemplate = `<span style="padding: 10px; color: red; font-size: 12pt;">${this.translateService.instant('COMMON.TABLE.BODY.EMPTY_DATA')}</span>`;

    this.columnDefs =
    [
      {
        headerName: this.translateService.instant('COMMON.TABLE.HEADER.ACTIONS'),
        minWidth: 100,
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
            /*component: TableBtnFinancialReceipts,
            params: { ...params }*/
          };
        }
      },
      {
        headerName: '#',
        valueGetter: 'node.rowIndex + 1',
        width: 70,
        cellClass: 'ag_cell_row_index'
      },
      {
        headerName: this.translateService.instant('COMMON.TABLE.HEADER.DESIGNATION'),
        field: 'description', minWidth: 250, flex: 1,
        cellClass: 'ag_cell_center'
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.STOCK.TABLE.HEADER.STATISTIC.UNIT.TITLE'),
        children: [
          {
            headerName: this.translateService.instant('ADMIN.CENTRE.STOCK.TABLE.HEADER.STATISTIC.UNIT.BUY'),
            field: 'profitAmount',
            width: 120, cellClass: 'ag_cell_center',
          },
          {
            headerName: this.translateService.instant('ADMIN.CENTRE.STOCK.TABLE.HEADER.STATISTIC.UNIT.SALE'),
            field: 'profitPercent',
            width: 120, cellClass: 'ag_cell_center',
          }
        ]
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.STOCK.TABLE.HEADER.STATISTIC.PROFIT'),
        children: [
          {
            headerName: 'MT',
            field: 'profitAmount',
            width: 110, cellClass: 'ag_cell_center',
          },
          {
            headerName: '%',
            field: 'profitPercent',
            width: 90, cellClass: 'ag_cell_center',
          }
        ]
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.STOCK.TABLE.HEADER.STATISTIC.QTY'),
        children: [
          {
            headerName: this.translateService.instant('ADMIN.CENTRE.STOCK.TABLE.HEADER.STATISTIC.QTY_WAREHOUSE'),
            field: 'updateAt', minWidth: 100, flex: 1,
            cellClass: 'ag_cell_center',
            cellRenderer: (params: ITableParams) => {
              return formatValue('', params.value);
            }
          },
          {
            headerName: this.translateService.instant('ADMIN.CENTRE.STOCK.TABLE.HEADER.STATISTIC.QTY_STORE'),
            field: 'updateAt', minWidth: 100, flex: 1,
            cellClass: 'ag_cell_center',
            cellRenderer: (params: ITableParams) => {
              return formatValue('', params.value);
            }
          },
          {
            headerName: this.translateService.instant('ADMIN.CENTRE.STOCK.TABLE.HEADER.STATISTIC.TOTAL'),
            field: 'updateAt', minWidth: 100, flex: 1,
            cellClass: 'ag_cell_center',
            cellRenderer: (params: ITableParams) => {
              return formatValue('', params.value);
            }
          }
        ]
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.STOCK.TABLE.HEADER.STATISTIC.TOTAL'),
        children: [
          {
            headerName: this.translateService.instant('ADMIN.CENTRE.STOCK.TABLE.HEADER.STATISTIC.TOTAL_BUY'),
            field: 'updateAt', minWidth: 100, flex: 1,
            cellClass: 'ag_cell_center',
            cellRenderer: (params: ITableParams) => {
              return formatValue('', params.value);
            }
          },
          {
            headerName: this.translateService.instant('ADMIN.CENTRE.STOCK.TABLE.HEADER.STATISTIC.TOTAL_SALE'),
            field: 'updateAt', minWidth: 100, flex: 1,
            cellClass: 'ag_cell_center',
            cellRenderer: (params: ITableParams) => {
              return formatValue('', params.value);
            }
          },
          {
            headerName: this.translateService.instant('ADMIN.CENTRE.STOCK.TABLE.HEADER.STATISTIC.TOTAL_PROFIT'),
            field: 'updateAt', minWidth: 100, flex: 1,
            cellClass: 'ag_cell_center',
            cellRenderer: (params: ITableParams) => {
              return formatValue('', params.value);
            }
          }
        ]
      }
    ];
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onSearch()
  {
    const searchLower = this.searchInput.toLowerCase();
    this.filteredData = this.rowData.filter(item =>
      Object.values(item).some(val => val?.toString().toLowerCase().includes(searchLower))
    );
  }

  private loadingData(format?: string): void
  {
    this.subs.add(
      this.translateService.onLangChange.subscribe(() => {
        this.tableData();
      })
    );

    switch (format)
    {
      case 'is_loading':
        this.tableLoading = true;
      break;
      default:
        break;
    }

    /*this.subs.add(
      this.financialService.getReceipts().subscribe((data: IFinancialReceipts[]) => {
        this.rowData = data;
        this.applyPagination();
        if (this.tableLoading) this.tableLoading = false;

        this.cdr.detectChanges();
      })
    );*/
  }
}

import { ChangeDetectorRef, Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IFinancialReceipts } from '@frontend-pharmacy/core/lib/interfaces/i-financial-response';
import { ITableParams } from '@frontend-pharmacy/core/lib/interfaces/i-table-dto';
import { formatValue } from '@frontend-pharmacy/core/utils/formattings';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, GridApi, GridOptions, GridReadyEvent, ModuleRegistry, RowSelectionOptions } from 'ag-grid-community';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

ModuleRegistry.registerModules([ AllCommunityModule ]);

@Component({
  selector: 'lib-layout-sales-pending',
  imports: [RippleModule, FloatLabelModule, FormsModule, AgGridAngular, InputIconModule, IconFieldModule, ReactiveFormsModule, InputTextModule, TranslateModule],
  templateUrl: './layout-sales-pending.html',
  styleUrl: './layout-sales-pending.scss',
})
export class LayoutSalesPending implements OnInit, OnDestroy {
  private readonly translateService = inject(TranslateService);

  private readonly cdr = inject(ChangeDetectorRef);
  private subs = new Subscription();

  protected tableLoading = true;

  protected searchInput = '';
  protected columnDefs: ColDef[] = [];
  protected rowData: IFinancialReceipts[] = [];
  protected filteredData: IFinancialReceipts[] = [];
  protected pageData: IFinancialReceipts[] = [];
  protected currentPage = 1;
  protected totalPages = 1;
  protected startIndex = 0;
  protected endIndex = 0;

  protected pageSize = 0;
  protected headerHeight = 50;
  protected rowHeight = 50;
  protected showTotalPag = 0;

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
    this.setPageSize();

    this.gridOptions.overlayNoRowsTemplate = `<span style="padding: 10px; color: red; font-size: 12pt;">${this.translateService.instant('COMMON.TABLE.BODY.EMPTY_DATA')}</span>`;

    this.columnDefs =
    [
      {
        headerName: this.translateService.instant('COMMON.TABLE.HEADER.ACTIONS'),
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
        headerName: this.translateService.instant('ADMIN.CENTRE.SALES.TABLE.HEADER.CUSTOMER'),
        field: 'customer', minWidth: 200, flex: 1,
        cellClass: 'ag_cell_center'
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.SALES.TABLE.HEADER.QTY'),
        field: 'qty', minWidth: 150, flex: 1,
        cellClass: 'ag_cell_end',
        cellRenderer: (params: ITableParams) => {
          return formatValue('', params.value);
        }
      },
      {
        headerName: this.translateService.instant('COMMON.TABLE.HEADER.DESIGNATION'),
        field: 'designation', minWidth: 150, flex: 1,
        cellClass: 'ag_cell_end',
        cellRenderer: (params: ITableParams) => {
          return formatValue('', params.value);
        }
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.SALES.TABLE.HEADER.TOTAL'),
        field: 'totalAmount', minWidth: 150, flex: 1,
        cellClass: 'ag_cell_end',
        cellRenderer: (params: ITableParams) => {
          return formatValue('', params.value);
        }
      },
      {
        headerName: this.translateService.instant('COMMON.TABLE.HEADER.DATE'),
        field: 'date', minWidth: 150, flex: 1,
        cellClass: 'ag_cell_end',
        cellRenderer: (params: ITableParams) => {
          return formatValue('', params.value);
        }
      }
    ];
  }

  @HostListener('window:resize')
  onResize() {
    this.setPageSize();
  }

  private setPageSize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width > 1700 && height >= 1008) {
      this.pageSize = 16;
    } else if (width > 1500 && height >= 800) {
      this.pageSize = 12;
    } else if (width >= 1366 && height >= 720) {
      this.pageSize = 10;
    } else {
      this.pageSize = 8;
    }
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

    this.currentPage = 1;
    this.applyPagination();
  }

  applyPagination()
  {
    //const dataToPaginate = this.rowData;
    const dataToPaginate = this.searchInput ? this.filteredData : this.rowData;
    this.totalPages = Math.ceil(dataToPaginate.length / this.pageSize);
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, dataToPaginate.length);
    this.pageData = dataToPaginate.slice(this.startIndex, this.endIndex);
    this.showTotalPag = dataToPaginate.length;
  }

  gotToPrevious()
  {
    if (this.currentPage > 1)
    {
      this.currentPage--;
      this.applyPagination();
    }
  }

  goToNext()
  {
    if (this.currentPage < this.totalPages)
    {
      this.currentPage++;
      this.applyPagination();
    }
  }

  goToStart() {
    if (this.currentPage !== 1) {
      this.currentPage = 1;
      this.applyPagination();
    }
  }

  goToEnd() {
    if (this.currentPage !== this.totalPages) {
      this.currentPage = this.totalPages;
      this.applyPagination();
    }
  }

  goToPage(page: number | string) {
    if (typeof page === 'number') {
      this.currentPage = page;
    } else {
      if (page === '...') {
        return; // Não faz nada quando clicar nas reticências.
      }
    }
    this.applyPagination();
  }

  isNumber(value: number | string): value is number {
    return typeof value === 'number';
  }

  get totalPagesArray(): (number | string)[] {
    const maxVisiblePages = 5;
    const pages = [];

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        pages.push(1, 2, 3, '...', this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(1, '...', this.totalPages - 2, this.totalPages - 1, this.totalPages);
      } else {
        pages.push(1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', this.totalPages);
      }
    }

    return pages;
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

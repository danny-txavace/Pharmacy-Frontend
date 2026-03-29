import { ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IAccountsBalanceTblResponse } from '@frontend-pharmacy/core/lib/interfaces/i-financial-response';
import { CountUpRepository } from '@frontend-pharmacy/core/lib/repositories/count-up-repository';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, GridApi, GridOptions, GridReadyEvent, ModuleRegistry, RowSelectionOptions } from 'ag-grid-community';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

ModuleRegistry.registerModules([ AllCommunityModule ]);

@Component({
  selector: 'lib-cash-register',
  imports: [TranslateModule, RippleModule, FloatLabel, FormsModule, AgGridAngular, InputIcon, IconField, ReactiveFormsModule, InputTextModule, TranslateModule],
  templateUrl: './cash-register.html',
  styleUrl: './cash-register.scss',
})
export class CashRegister implements OnInit, OnDestroy {
  private readonly translateService = inject(TranslateService);
  private readonly countUpRep = inject(CountUpRepository);
  private readonly cdr = inject(ChangeDetectorRef);

  private subs = new Subscription();

  protected tableLoading = true;
  protected searchInput = '';
  protected columnDefs: ColDef[] = [];
  protected rowData: IAccountsBalanceTblResponse[] = [];
  protected filteredData: IAccountsBalanceTblResponse[] = [];
  protected pageData: IAccountsBalanceTblResponse[] = [];
  protected currentPage = 1;
  protected totalPages= 1;
  protected startIndex= 0;
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

   // Total Cards
  @ViewChild ('countUpAmount_InitialBalance') countUpAmount_InitialBalance!: ElementRef;
  @ViewChild ('countUpAmount_TotalRevenue') countUpAmount_TotalRevenue!: ElementRef;
  @ViewChild ('countUpAmount_TotalExpense') countUpAmount_TotalExpense!: ElementRef;
  @ViewChild ('countUpAmount_TotalProfit') countUpAmount_TotalProfit!: ElementRef;

  ngOnInit(): void {
    this.tableData();
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
        minWidth: 80,
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
            //component: BtnTableRegister,
            //params: { ...params }
          };
        }
      },
      {
        headerName: '#',
        width: 70,
        cellClass: 'ag_cell_row_index',
        /*valueGetter: (params) => {
          const page = params.api.paginationGetCurrentPage();
          const pageSize = params.api.paginationGetPageSize();
          const rowIndex = params.node?.rowIndex ?? 0;

          return page * pageSize + rowIndex + 1;
        }*/
       valueGetter: (params) => {
          if (params.node == null || params.node.rowIndex == null) return '';
          return params.node.rowIndex + 1 +
            params.api.paginationGetCurrentPage() *
            params.api.paginationGetPageSize();
        }
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.CASH_REGISTER.TABLE.HEADER.OPERATOR'),
        field: 'operator', minWidth: 150, flex: 1,
        cellClass: 'ag_cell_start'
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.CASH_REGISTER.TABLE.HEADER.STATUS'),
        field: 'status',
        minWidth: 100,
        flex: 1,
        cellClass: 'ag_cell_center'
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.CASH_REGISTER.TABLE.HEADER.TOTAL_OPENED'),
        field: 'totalOpened', minWidth: 180, flex: 1,
        cellClass: 'ag_cell_end'
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.CASH_REGISTER.TABLE.HEADER.TOTAL_CLOSED'),
        field: 'totalClosed', minWidth: 180, flex: 1,
        cellClass: 'ag_cell_end'
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.CASH_REGISTER.TABLE.HEADER.OPENED_AT'),
        field: 'openedAt',
        minWidth: 180,
        flex: 1,
        cellClass: 'ag_cell_center'
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.CASH_REGISTER.TABLE.HEADER.CLOSED_AT'),
        field: 'closedAt',
        minWidth: 180,
        flex: 1,
        cellClass: 'ag_cell_center'
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

  private loadingData(): void
  {
    this.tableLoading = true;

    /*this.subs.add(
      this.cashRegstService.getAll().subscribe((data: any) => {
        this.tableLoading = false;
        this.rowData = data;
        this.applyPagination();
        this.cdr.detectChanges();
      })
    );*/
  }

  private loadingCards(): void
  {
    /*this.subs.add(
      this.cashRegstService.getCards().subscribe(value => {
        setTimeout(() => {
          this.countUpRep.onCountUp('countUp-Amount', this.countUpAmount_InitialBalance, value.initialBalance);
          this.countUpRep.onCountUp('countUp-Amount', this.countUpAmount_TotalRevenue, value.totalRevenue);
          this.countUpRep.onCountUp('countUp-Amount', this.countUpAmount_TotalExpense, value.totalExpense);
          this.countUpRep.onCountUp('countUp-Amount', this.countUpAmount_TotalProfit, value.totalProfit);
        }, 300)
      })
    );*/
  }

  onDialogOpenCash(): void {
    const payload = {
      format: 'open-cash_register',
      isVisible: true
    }
    //this.dialogCreateRep.send(payload)
  }

  onDialogCloseCash(): void {
    const payload = {
      format: 'close-cash_register',
      isVisible: true
    }
    //this.dialogCreateRep.send(payload)
  }

  onDialogCashIn(): void {
    const payload = {
      format: 'create-cash_register',
      isVisible: true,
      id: 'cash in'
    }
    //this.dialogCreateRep.send(payload)
  }

  onDialogCashOut(): void {
    const payload = {
      format: 'create-cash_register',
      isVisible: true,
      id: 'cash out'
    }
    //this.dialogCreateRep.send(payload)
  }
}

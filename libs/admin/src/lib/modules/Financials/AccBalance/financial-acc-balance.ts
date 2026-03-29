import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IAccountsBalanceTblResponse } from '@frontend-pharmacy/core/lib/interfaces/i-financial-response';
import { ITableParams } from '@frontend-pharmacy/core/lib/interfaces/i-table-dto';
import { CountUpRepository } from '@frontend-pharmacy/core/lib/repositories/count-up-repository';
import { formatValue, formatDateNoTime } from '@frontend-pharmacy/core/utils/formattings';
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
  selector: 'lib-financial-acc-balance',
  imports: [RippleModule, FloatLabelModule, FormsModule, InputIconModule, IconFieldModule, ReactiveFormsModule, InputTextModule, AgGridAngular, TranslateModule],
  templateUrl: './financial-acc-balance.html',
  styleUrl: './financial-acc-balance.scss',
})
export class FinancialAccBalance implements OnInit, OnDestroy {
  //private readonly financialService = inject(AdminFinancialService);
  //private readonly notificationService = inject(NotificationService);
  private readonly translateService = inject(TranslateService);
  //private readonly dialogCreateRep = inject(DialogCreateRepository);

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly countUpRep = inject(CountUpRepository);
  private subs = new Subscription();

  @ViewChild ('countUpAmount_total') countUpAmount_total!: ElementRef;
  @ViewChild ('countUpAmount_cash') countUpAmount_cash!: ElementRef;
  @ViewChild ('countUpAmount_bci') countUpAmount_bci!: ElementRef;
  @ViewChild ('countUpAmount_mPesa') countUpAmount_mPesa!: ElementRef;
  @ViewChild ('countUpAmount_eMola') countUpAmount_eMola!: ElementRef;

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

  ngOnInit(): void {
    this.loadingData();
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
        headerName: '#',
        valueGetter: 'node.rowIndex + 1',
        width: 70,
        cellClass: 'ag_cell_row_index'
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.FINANCIAL.ACC_BALANCE.TABLE_HEADER.ORIGIN'),
        field: 'origin', minWidth: 150, flex: 1,
        cellClass: 'ag_cell_center',
        cellRenderer: (params: ITableParams) => {
          let method;

          if (params.value == 'bci')
          { method = this.translateService.instant('COMMON.PAYMENT_METHODS.BCI'); }
          else if (params.value == 'cash')
          { method = this.translateService.instant('COMMON.PAYMENT_METHODS.CASH'); }
          if (params.value == 'eMola')
          { method = this.translateService.instant('COMMON.PAYMENT_METHODS.EMOLA'); }
          if (params.value == 'mPesa')
          { method = this.translateService.instant('COMMON.PAYMENT_METHODS.MPESA'); }

          return method;
        }
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.FINANCIAL.ACC_BALANCE.TABLE_HEADER.DESTINATION'),
        field: 'destination', minWidth: 150, flex: 1,
        cellClass: 'ag_cell_center',
        cellRenderer: (params: ITableParams) => {
          let method;

          if (params.value == 'bci')
          { method = this.translateService.instant('COMMON.PAYMENT_METHODS.BCI'); }
          else if (params.value == 'cash')
          { method = this.translateService.instant('COMMON.PAYMENT_METHODS.CASH'); }
          if (params.value == 'eMola')
          { method = this.translateService.instant('COMMON.PAYMENT_METHODS.EMOLA'); }
          if (params.value == 'mPesa')
          { method = this.translateService.instant('COMMON.PAYMENT_METHODS.MPESA'); }

          return method;
        }
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.FINANCIAL.ACC_BALANCE.TABLE_HEADER.AMOUNT'),
        field: 'totalAmount', minWidth: 150, flex: 1,
        cellClass: 'ag_cell_end',
        cellRenderer: (params: ITableParams) => {
          return formatValue('', params.value);
        }
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.FINANCIAL.ACC_BALANCE.TABLE_HEADER.TRANSACTION_FEE'),
        field: 'transactionFee', minWidth: 90, flex: 1,
        cellClass: 'ag_cell_end',
        cellRenderer: (params: ITableParams) => {
          return formatValue('', params.value);
        }
      },
      {
        headerName: this.translateService.instant('COMMON.TABLE.HEADER.DATE'),
        field: 'createdAt', minWidth: 100, flex: 1,
        cellClass: 'ag_cell_center',
        cellRenderer: (params: ITableParams) => {
          return formatDateNoTime(params.value);
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
      this.pageSize = 14;
    } else if (width > 1500 && height >= 800) {
      this.pageSize = 10;
    } else if (width >= 1366 && height >= 700) {
      this.pageSize = 8;
    } else {
      this.pageSize = 6;
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

    this.loadingCards();
    this.loadingList(format);
  }

  private loadingList(format?: string): void
  {
    switch (format)
    {
      case 'is_loading':
        this.tableLoading = true;
      break;
      default:
        break;
    }

    /*this.subs.add(
      this.financialService.getTblAccountsBalance().subscribe((data: IAccountsBalanceTblResponse[]) => {
        this.rowData = data;
        this.applyPagination();
        if (this.tableLoading) this.tableLoading = false;

        this.cdr.detectChanges();
      })
    );*/
  }

  private loadingCards(): void
  {
    /*this.subs.add(
      this.financialService.getCardsAccountsBalance().subscribe((value: IAccountsBalanceCardResponse) => {
        setTimeout(() => {
          this.countUpRep.onCountUp('countUp-Amount', this.countUpAmount_total, value.total);
          this.countUpRep.onCountUp('countUp-Amount', this.countUpAmount_cash, value.cash);
          this.countUpRep.onCountUp('countUp-Amount', this.countUpAmount_bci, value.bci);
          this.countUpRep.onCountUp('countUp-Amount', this.countUpAmount_mPesa, value.mPesa);
          this.countUpRep.onCountUp('countUp-Amount', this.countUpAmount_eMola, value.eMola);
        }, 300)
      })
    );*/
  }

  protected onDialogCreate(): void
  {
    const payload = {
      format: 'admin-financial_acc_balance-transfer',
      isVisible: true
    }
    //this.dialogCreateRep.send(payload);
  }
}

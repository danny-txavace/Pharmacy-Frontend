import { ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, GridApi, GridOptions, GridReadyEvent, ModuleRegistry, RowSelectionOptions } from 'ag-grid-community';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';
import { CountUpRepository } from '@frontend-pharmacy/core/lib/repositories/count-up-repository';
import { IFinancialAccountsTblResponse } from '@frontend-pharmacy/core/lib/interfaces/i-financial-response';
import { formatDateNoTime, formatValue } from '@frontend-pharmacy/core/utils/formattings';
import { ITableParams } from '@frontend-pharmacy/core/lib/interfaces/i-table-dto';

ModuleRegistry.registerModules([ AllCommunityModule ]);

@Component({
  selector: 'lib-financial-acc-payable',
  imports: [RippleModule, FloatLabelModule, FormsModule, AgGridAngular, InputIconModule, IconFieldModule, ReactiveFormsModule, InputTextModule, TranslateModule],
  templateUrl: './financial-acc-payable.html',
  styleUrl: './financial-acc-payable.scss',
})
export class FinancialAccPayable implements OnInit, OnDestroy {
  //private readonly financialService = inject(AdminFinancialService);
  //private readonly notificationService = inject(NotificationService);
  private readonly translateService = inject(TranslateService);
  //private readonly dialogCreateRep = inject(DialogCreateRepository);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly countUpRep = inject(CountUpRepository);
  private subs = new Subscription();

  @ViewChild ('countUpQty_toPay') countUpQty_toPay!: ElementRef;
  @ViewChild ('countUpAmount_toPay') countUpAmount_toPay!: ElementRef;
  @ViewChild ('countUpQty_dueSoon') countUpQty_dueSoon!: ElementRef;
  @ViewChild ('countUpAmount_dueSoon') countUpAmount_dueSoon!: ElementRef;
  @ViewChild ('countUpQty_overdue') countUpQty_overdue!: ElementRef;
  @ViewChild ('countUpAmount_overdue') countUpAmount_overdue!: ElementRef;
  @ViewChild ('countUpQty_paid') countUpQty_paid!: ElementRef;
  @ViewChild ('countUpAmount_paid') countUpAmount_paid!: ElementRef;

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

  ngOnInit(): void {
    this.loadingData();
    this.tableData();
    //this.loadingData('is_loading');
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
      },
      {
        headerName: '#',
        valueGetter: 'node.rowIndex + 1',
        width: 70,
        cellClass: 'ag_cell_row_index'
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.FINANCIAL.ACC_PAYABLE.TABLE.HEADER.NAME'),
        field: 'fullName', minWidth: 140, flex: 1, wrapText: true, autoHeight: true,
        cellClass: 'ag_cell_start',
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.FINANCIAL.ACC_PAYABLE.TABLE.HEADER.DESCRIPTION'),
        field: 'description', minWidth: 300, flex: 1, wrapText: true, autoHeight: true,
        cellClass: 'ag_cell_start'
      },
      {
        headerName: this.translateService.instant('ADMIN.CENTRE.FINANCIAL.ACC_PAYABLE.TABLE.HEADER.AMOUNT'),
        field: 'totalAmount', minWidth: 120, flex: 1,
        cellClass: 'ag_cell_end',
        cellRenderer: (params: ITableParams) => {
          return formatValue('', params.value);
        }
      },
      {
        headerName: this.translateService.instant('COMMON.TABLE.HEADER.STATUS'),
        field: 'expirationAt', minWidth: 140, flex: 1,
        cellClass: 'ag_cell_center',
        cellRenderer: (params: ITableParams) => {
          return formatDateNoTime(params.value);
        }
      },
      {
        headerName: this.translateService.instant('COMMON.TABLE.HEADER.DATE'),
        field: 'expirationAt', minWidth: 140, flex: 1,
        cellClass: 'ag_cell_center',
        cellRenderer: (params: ITableParams) => {
          return formatDateNoTime(params.value);
        }
      }
    ];
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onSearch()
  {
    const searchLower = this.searchInput.toLowerCase();

    if (!searchLower) {
      this.filteredData = this.rowData;
    } else {
      this.filteredData = this.rowData.filter(item =>
        Object.values(item).some(val => val?.toString().toLowerCase().includes(searchLower))
      );
    }

    // Update grid with filtered data
    if (this.gridApi) {
      this.gridApi.setGridOption('rowData', this.filteredData);
      this.gridApi.refreshClientSideRowModel();
    }
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
      this.financialService.getTblAccountsPayable().subscribe((data: IFinancialAccountsTblResponse[]) => {
        this.rowData = data;
        if (this.tableLoading) this.tableLoading = false;

        this.cdr.detectChanges();
      })
    );*/
  }

  private loadingCards(): void
  {
    /*this.subs.add(
      this.financialService.getCardsAccountsPayable().subscribe(value => {
        setTimeout(() => {
          this.countUpRep.onCountUp('countUp-Qty', this.countUpQty_toPay, value.toPayQty);
          this.countUpRep.onCountUp('countUp-Amount', this.countUpAmount_toPay, value.toPayAmount);
          this.countUpRep.onCountUp('countUp-Qty', this.countUpQty_dueSoon, value.dueSoonQty);
          this.countUpRep.onCountUp('countUp-Amount', this.countUpAmount_dueSoon, value.dueSoonAmount);
          this.countUpRep.onCountUp('countUp-Qty', this.countUpQty_overdue, value.overdueQty);
          this.countUpRep.onCountUp('countUp-Amount', this.countUpAmount_overdue, value.overdueAmount);
          this.countUpRep.onCountUp('countUp-Qty', this.countUpQty_paid, value.paidQty);
          this.countUpRep.onCountUp('countUp-Amount', this.countUpAmount_paid, value.paidAmount);
        }, 300)
      })
    );*/
  }

  protected onDialogCreate(): void
  {
    const payload = {
      format: 'admin-acc_payable-create',
      isVisible: true
    }
    //this.dialogCreateRep.send(payload);
  }
}

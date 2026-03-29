import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { IUserGetAllResponse } from '@frontend-pharmacy/core/lib/interfaces/i-people';
import { TranslateModule } from '@ngx-translate/core';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardPeopleSupplier } from "../../../components/_cards/people/suppliers/card-people-supplier";

@Component({
  selector: 'lib-people-suppliers',
  imports: [RippleModule, TranslateModule, FloatLabelModule, FormsModule, InputIconModule, IconFieldModule, ReactiveFormsModule, InputTextModule, CardPeopleSupplier],
  templateUrl: './people-suppliers.html',
  styleUrl: './people-suppliers.scss',
})
export class PeopleSuppliers implements OnInit, OnDestroy {
  private readonly subs = new Subscription();
  protected isLoading = signal<boolean>(true);
  protected searchInput = '';

  items: IUserGetAllResponse[] = [];
  totalItems = 0;
  pageSize = 9;
  currentPage = 1;

  ngOnInit(): void {
    this.loadPage(this.currentPage);
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }

  protected onDialogCreate(): void
  {
    const payload = {
      format: 'admin-settings_news-create',
      isVisible: true
    }
    //this.dialogCreateRep.send(payload);
  }

  onSearch()
  {
    this.searchInput.toLowerCase();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize); // usa totalItems da API
  }

  get paginatedItems(): IUserGetAllResponse[] {
    return this.items; // agora items já é só a página atual
  }

  // Métodos de navegação permanecem iguais
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPage(page);
    }
  }

  goToNext() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPage(this.currentPage);
    }
  }

  gotToPrevious() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPage(this.currentPage);
    }
  }

  goToStart() {
    this.currentPage = 1;
    this.loadPage(1);
  }

  goToEnd() {
    this.currentPage = this.totalPages;
    this.loadPage(this.totalPages);
  }

  get totalPagesArray(): (number | string)[] {
    const maxVisiblePages = 5;
    const pages: (number | string)[] = [];

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (this.currentPage <= 3) {
      pages.push(1, 2, 3, '...', this.totalPages);
      return pages;
    }

    if (this.currentPage >= this.totalPages - 2) {
      pages.push(
        1,
        '...',
        this.totalPages - 2,
        this.totalPages - 1,
        this.totalPages
      );
      return pages;
    }

    pages.push(
      1,
      '...',
      this.currentPage - 1,
      this.currentPage,
      this.currentPage + 1,
      '...',
      this.totalPages
    );

    return pages;
  }

  isNumber(value: unknown): value is number {
    return typeof value === 'number';
  }

  private loadPage(page: number): void
  {
    /*this.isLoading.set(true);
    this.subs.add(
      this.settingService.getCardVlog(page, this.pageSize).subscribe(resp => {
        this.items = resp.items;
        this.totalItems = resp.totalItems;
        this.isLoading.set(false);
      })
    );*/
  }
}

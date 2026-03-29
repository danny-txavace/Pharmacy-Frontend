import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface BreadCrumb {
  is_button: boolean
  icon?: string
  label: string
  url?: string[]
}

@Injectable({
  providedIn: 'root',
})
export class BreadCrumbRepository {
  private storageKey = 'breadcrumb';
  private _breadcrump$ = new BehaviorSubject<BreadCrumb[]>(this.getInitialTitle());
  breadcrumbs$ = this._breadcrump$.asObservable();


  getBreadcrumbs(): BreadCrumb[] {
    return this._breadcrump$.getValue();
  }

  setBreadcrumbs(breadcrumbs: BreadCrumb[]) {
    this.clear();
    this._breadcrump$.next(breadcrumbs);
    localStorage.setItem(this.storageKey, JSON.stringify(breadcrumbs));
  }

  private clear() {
    this._breadcrump$.next([]);
    localStorage.removeItem(this.storageKey);
  }

  private getInitialTitle(): BreadCrumb[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  addBreadcrumb(breadcrumb: BreadCrumb) {
    const current = this._breadcrump$.getValue();
    const exists = current.find(b => b.label === breadcrumb.label);

    if (!exists) {
      const updated = [...current, breadcrumb];
      this._breadcrump$.next(updated);
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    }
  }
}

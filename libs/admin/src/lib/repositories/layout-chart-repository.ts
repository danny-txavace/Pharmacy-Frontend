import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutChartRepository {
  private resizeSubject = new Subject<void>();
  onLayoutChange$ = this.resizeSubject.asObservable();

  emitResize() {
    this.resizeSubject.next();
  }
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AuthService } from '@frontend-pharmacy/core/lib/services/auth.service';
import { I18nRepository } from '@frontend-pharmacy/core/lib/repositories/i18n-repository';

@Component({
  selector: 'lib-initial-loader',
  imports: [],
  templateUrl: './initial-loader.html',
  styleUrl: './initial-loader.scss',
})
export class InitialLoader implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly subs = new Subscription();
  private readonly i18nRep = inject(I18nRepository);

  isLoading = true;

  ngOnInit(): void {
    const auth = `/${this.i18nRep.getLang()}/auth`;

    setTimeout(() => {
      /*this.subs.add(
        this.authService
          .checkSession()
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.isLoading = false;
            this.router.navigateByUrl(signIn, { replaceUrl: true });
          })
      );*/
      this.router.navigateByUrl(auth, { replaceUrl: true });
    }, 300)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.subs) this.subs.unsubscribe();
  }
}

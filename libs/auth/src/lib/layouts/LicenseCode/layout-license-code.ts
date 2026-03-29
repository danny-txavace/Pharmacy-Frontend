import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { I18nRepository } from '@frontend-pharmacy/core/lib/repositories/i18n-repository';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'lib-layout-license-code',
  imports: [InputTextModule, ReactiveFormsModule, MessageModule, CommonModule],
  templateUrl: './layout-license-code.html',
  styleUrl: './layout-license-code.scss',
})
export class LayoutLicenseCode implements OnInit, OnDestroy {
  private readonly i18nRep = inject(I18nRepository);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly subs = new Subscription();

  protected form!: FormGroup;
  protected isLoading = signal(false);
  protected isError = signal(false);

  ngOnInit(): void {
    this.initializeForm();
    this.autoSubmit();
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }

  private initializeForm()
  {
    this.form = this.fb.group({
      code: ['', Validators.required]
    });
  }

  autoSubmit(): void {
    this.subs.add(
      this.form.get('code')?.valueChanges.pipe(
        distinctUntilChanged(),
      )
      .subscribe(value => {
        if (value.length == 5) {
          console.log('code: ', value)
          this.isLoading.set(true);

          setTimeout(() => {
            this.isLoading.set(false);

            const auth = `/${this.i18nRep.getLang()}/auth/license-success`;
            this.router.navigateByUrl(auth, { replaceUrl: true });
          }, 5000)
          return;
        }
      })
    );
  }
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-layout-setting-payment-method',
  imports: [DividerModule, RippleModule, ToggleSwitchModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './layout-setting-payment-method.html',
  styleUrl: './layout-setting-payment-method.scss',
})
export class LayoutSettingPaymentMethod implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly subs = new Subscription();

  protected form!: FormGroup;
  protected loading = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }

  private initializeForm()
  {
    this.form = this.fb.group({
      absa: [false],
      bci: [false],
      eMola: [false],
      mKesh: [false],
      mPesa: [false],
      bim: [false],
      moza: [false],
      cash: [false],
      standard: [false]
    });
  }

  protected onSubmit(): void {
    this.loading = true;
    console.log('saved: ', this.form.value);
  }
}

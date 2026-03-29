import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RippleModule } from 'primeng/ripple';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-layout-setting-other',
  imports: [TranslateModule, DividerModule, RippleModule, IconFieldModule, InputIconModule, InputNumberModule, ReactiveFormsModule],
  templateUrl: './layout-setting-other.html',
  styleUrl: './layout-setting-other.scss',
})
export class LayoutSettingOther implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly subs = new Subscription();

  protected form!: FormGroup;
  protected isLoading = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }

  private initializeForm()
  {
    this.form = this.fb.group({
      iva: [null],
      stock: [null]
    });
  }

  protected onSubmit(): void {
    this.isLoading = true;

    if (!this.form.invalid)
    {
      console.log('saved: ', this.form.value);
    }
  }
}

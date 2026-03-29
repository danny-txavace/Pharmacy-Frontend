import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-layout-setting-notification',
  imports: [DividerModule, RippleModule, ToggleSwitchModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './layout-setting-notification.html',
  styleUrl: './layout-setting-notification.scss',
})
export class LayoutSettingNotification implements OnInit, OnDestroy {
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
      notf_1: [false],
      notf_2: [false],
      notf_3: [false],
      notf_4: [false],
      notf_5: [false],
      notf_6: [false],
      notf_7: [false],
      notf_8: [false]
    });
  }

  protected onSubmit(): void {
    this.loading = true;
    console.log('saved: ', this.form.value);
  }
}


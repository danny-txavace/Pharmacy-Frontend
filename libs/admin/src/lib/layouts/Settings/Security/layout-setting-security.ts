import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageModule } from 'primeng/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-layout-setting-security',
  imports: [DividerModule, RippleModule, InputTextModule, InputIconModule, IconFieldModule, ReactiveFormsModule, CommonModule, MessageModule, TranslateModule],
  templateUrl: './layout-setting-security.html',
  styleUrl: './layout-setting-security.scss',
})
export class LayoutSettingSecurity implements OnInit, OnDestroy {
  private readonly translateService = inject(TranslateService);

  private readonly fb = inject(FormBuilder);
  private readonly subs = new Subscription();

  protected form!: FormGroup;

  protected isCurrentPassword = false;
  protected isNewPassword = false;
  protected isConfirmNewPassword = false;

  protected isErrorCurrentPassword = false;
  protected isErrorNewPassword = false;
  protected isErrorConfirmNewPassword = false;

  protected isTooShortCurrentPassword = false;
  protected isTooShortNewPassword = false;
  protected isTooShortConfirmNewPassword = false;
  protected isDoNotMatchPassword = false;
  protected msg = signal<string>('');

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
      currentPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      confirmNewPassword: [null, Validators.required]
    });
  }

  protected isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control.touched || this.isLoading);
  }

  protected togglePassword(format: string): void {
    switch(format) {
      case 'currentPassword':
        this.isCurrentPassword = !this.isCurrentPassword;
        break;
      case 'newPassword':
        this.isNewPassword = !this.isNewPassword;
        break;
      case 'confirmNewPassword':
        this.isConfirmNewPassword = !this.isConfirmNewPassword;
        break;
    }
  }

  protected getFormErrors(): void {
    if (this.form.value.currentPassword == null) {
      this.isErrorCurrentPassword = true;
    } else {
      this.isErrorCurrentPassword = false;
    }

    if (this.form.value.newPassword == null) {
      this.isErrorNewPassword = true;
    } else {
      this.isErrorNewPassword = false;
    }

    if (this.form.value.confirmNewPassword == null) {
      this.isErrorConfirmNewPassword = true;
    } else {
      this.isErrorConfirmNewPassword = false;
    }
  }

  protected resetFormErrors(): void {
    this.isTooShortCurrentPassword = false;
    this.isTooShortNewPassword = false;
    this.isTooShortConfirmNewPassword = false;
    this.isDoNotMatchPassword = false;
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.getFormErrors();

      return;
    }

    this.isLoading = true;

    this.resetFormErrors();

    const currentPassword = this.form.value.currentPassword;
    const newPassword = this.form.value.newPassword;
    const confirmNewPassword = this.form.value.confirmNewPassword;

    if (currentPassword !== null && currentPassword.length > 0 && currentPassword.length < 6) {
      this.isLoading = false;
      this.isTooShortCurrentPassword = true;

      const info = this.translateService.instant('ADMIN.CENTRE.SETTINGS.SECURITY.ERROR.PASSWORD_TOO_SHORT');
      this.msg.set(info);

      return;
    }

    if (newPassword !== null && newPassword.length > 0 && newPassword.length < 6) {
      this.isLoading = false;
      this.isTooShortNewPassword = true;

      const info = this.translateService.instant('ADMIN.CENTRE.SETTINGS.SECURITY.ERROR.NEW_PASSWORD_TOO_SHORT');
      this.msg.set(info);

      return;
    }

    if (confirmNewPassword !== null && confirmNewPassword.length > 0 && confirmNewPassword.length < 6) {
      this.isLoading = false;
      this.isTooShortConfirmNewPassword = true;

      const info = this.translateService.instant('ADMIN.CENTRE.SETTINGS.SECURITY.ERROR.CONFIRM_PASSWORD_TOO_SHORT');
      this.msg.set(info);

      return;
    }

    if (newPassword !== confirmNewPassword) {
      this.isLoading = false;
      this.isDoNotMatchPassword = true;

      const info = this.translateService.instant('ADMIN.CENTRE.SETTINGS.SECURITY.ERROR.MISMATCH');
      this.msg.set(info);

      return;
    }

    if (this.form.valid)
    {
      console.log('saved: ', this.form.value);
    }
  }
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { NgClass, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { TranslateModule } from '@ngx-translate/core';
import { I18nRepository } from '@frontend-pharmacy/core/lib/repositories/i18n-repository';
import { AuthService } from '@frontend-pharmacy/core/lib/services/auth.service';
import { IAuthRequest } from '@frontend-pharmacy/core/lib/interfaces/i-auth';
import { Navbar } from "../../components/Navbar/navbar";
import { Footer } from "../../components/Footer/footer";
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'lib-layout-sign-in',
  imports: [InputTextModule, InputIconModule, IconFieldModule, NgClass, ReactiveFormsModule, CommonModule, MessageModule, TranslateModule, Navbar, Footer, RippleModule],
  templateUrl: './layout-sign-in.html',
  styleUrl: './layout-sign-in.scss',
})
export class LayoutSignIn implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly i18nRep = inject(I18nRepository);

  private readonly fb = inject(FormBuilder);
  private readonly subs = new Subscription();

  protected form!: FormGroup;
  protected isPasswordVisible = false;
  protected loading = false;

  protected isUserError = false;
  protected isPasswordError = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }

  private initializeForm()
  {
    this.form = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control.touched || this.loading);
  }

  onSubmit(): void
  {
    if (this.form.invalid) {
      this.loading = false;
      return;
    }

    this.navigateByRole('admin');
    /*this.loading = true;
    this.form.disable();

    const credentials: IAuthRequest = this.form.value;

    this.subs.add(
      this.authService.signIn(credentials).pipe(
        take(1)
      ).subscribe({
        next: (response) =>
        {
          this.navigateByRole(response.role);
          this.loading = false;
          this.form.enable();
        },
        error: () =>
        {
          this.loading = false;
          this.form.enable();
          this.isUserError = true;
          this.isPasswordError = true;
        }
      })
    );*/
  }

  private navigateByRole(role: string): void {
    const lang = this.i18nRep.getLang();

    const routes: Record<string, string> = {
      admin: `/${lang}/admin`,
      employee: `/${lang}/employee`,
    };
    const target = routes[role] ?? `/${lang}/auth/sign-in`;
    this.router.navigateByUrl(target, { replaceUrl: true });
  }
}

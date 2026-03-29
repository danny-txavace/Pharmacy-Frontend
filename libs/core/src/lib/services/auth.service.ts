import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, switchMap, catchError, throwError, of, finalize } from 'rxjs';
import { environment } from '../environments/environment';
import { IAuthRequest, IMeResponse, IAccTokenResponse } from '../interfaces/i-auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = `${environment.myGatewayApi}/api/v1/Auth`;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private accessToken: string | null = null;

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  signIn(auth: IAuthRequest): Observable<IMeResponse> {
    return this.http.post<IAccTokenResponse>(`${this.api}/sign-in`, auth).pipe(
      tap((res) => this.setAccessToken(res.acc_tk)),
      switchMap(() => this.me()),
      catchError((err) => {
        this.clearAuthState();
        const message = err.error?.message || 'Falha no login';
        return throwError(() => new Error(message));
      })
    );
  }

  refreshToken(): Observable<IMeResponse> {
    return this.http.post<IAccTokenResponse>(`${this.api}/refresh`, {}).pipe(
      tap((res) => this.setAccessToken(res.acc_tk)),
      switchMap(() => this.me()),
      catchError(() => {
        this.signOut();
        return throwError(() => new Error('Refresh failed'));
      })
    );
  }

  signOut(): void {
    this.http
      .post<void>(`${this.api}/sign-out`, {})
      .pipe(
        catchError(() => of(null)),
        finalize(() => {
          this.clearAuthState();
          this.router.navigate([this.getSignIn()], { replaceUrl: true });
        })
      )
      .subscribe();
  }

  private getSignIn(): string {
    const lang = localStorage.getItem('i18n') || 'pt';
    return `/${lang}/auth`;
  }

  me(): Observable<IMeResponse> {
    return this.http.get<IMeResponse>(`${this.api}/me`);
  }

  checkSession(): Observable<IMeResponse | null> {
    return this.http.get<IAccTokenResponse>(`${this.api}/check-session`).pipe(
      tap(res => this.setAccessToken(res.acc_tk)),
      switchMap(() => this.me()),
      catchError(() => {
        this.clearAuthState();
        // Retorna null se não conseguir validar
        return of(null);
      })
    );
  }

  private clearAuthState(): void {
    this.setAccessToken(null);
  }
}

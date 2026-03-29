import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { I18nRepository } from '@frontend-pharmacy/core/lib/repositories/i18n-repository';
import { AuthService } from '@frontend-pharmacy/core/lib/services/auth.service';
import { map, catchError, of } from 'rxjs';

export const sessionGuard: CanMatchFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const i18nRep = inject(I18nRepository);
  const signIn = `/${i18nRep.getLang()}/auth`;

  const allowedRoles: string[] = route.data?.['roles'] ?? [];

  return auth.checkSession().pipe(
    map(session => {
      // Sessão inválida
      if (session === null) {
        router.navigate([signIn], { replaceUrl: true });
        return false;
      }

      // Rota não tem restrição de role
      if (allowedRoles.length === 0) {
        return true;
      }

      // Role incompatível
      if (!allowedRoles.includes(session.role)) {
        router.navigateByUrl(getDefaultRouteByRole(session.role), {
          replaceUrl: true,
        });
        return false;
      }

      return true;
    }),
    catchError(() => {
      router.navigate([signIn], { replaceUrl: true });
      return of(false);
    })
  );
};

function getDefaultRouteByRole(role: string): string {
  const i18nRep = inject(I18nRepository);
  const lang = i18nRep.getLang();
  const signIn = `/${lang}/auth/sign-in`;

  const map: Record<string, string> = {
    admin: `/${lang}/admin`,
    student: `/${lang}/student`
  };

  return map[role] ?? signIn;
}

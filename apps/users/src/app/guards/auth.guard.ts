import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { I18nRepository } from '@frontend-pharmacy/core/lib/repositories/i18n-repository';
import { AuthService } from '@frontend-pharmacy/core/lib/services/auth.service';
import { catchError, map, of, take } from 'rxjs';

export const authGuard: CanActivateFn = (_, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const i18nRep = inject(I18nRepository);
  const lang = i18nRep.getLang();
  const signIn = `/${lang}/auth`;

  return auth.checkSession().pipe(
    take(1),
    map(session => {
      const isValid = !!session?.role && !!session?.fullName;

      if (isValid)
      {
        const routes: Record<string, string> = {
          admin: `/${lang}/admin`,
          student: `/${lang}/student`
        };
        const target = routes[session.role] ?? signIn;

        router.navigateByUrl(target, { replaceUrl: true })
        return false;
      }

      return true;
    }),
    catchError(() => {
      return of(
        router.createUrlTree([signIn], {
          queryParams: { returnUrl: state.url }
        })
      );
    })
  );
};

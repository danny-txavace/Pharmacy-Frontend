import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const langGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const lang = route.paramMap.get('lang');
  const allowed = ['en', 'es', 'fr', 'it', 'pt', 'zh', 'mkh', 'xig', 'seh']; // variantes corretas

  // se path estiver vazio ou inválido, redireciona para idioma guardado
  if (!lang || !allowed.includes(lang)) {
    return router.createUrlTree([`/${lang}`]);
  }

  return true;
};

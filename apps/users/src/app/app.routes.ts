import { Route } from '@angular/router';
import { langGuard } from './guards/lang.guard';

export const appRoutes: Route[] =
[
  {
    path: ':lang',
    pathMatch: 'full',
    redirectTo: ':lang/loading'
  },
  {
    canActivate: [langGuard],
    path: ':lang/loading',
    title: 'A carregar...',
    loadComponent: () => import('@frontend-pharmacy/auth/lib/modules/InitialLoader/initial-loader').then(u => u.InitialLoader)
  },
  {
    //canActivate: [authGuard, langGuard],
    canActivate: [langGuard],
    path: ':lang/auth',
    loadChildren: () => import('@frontend-pharmacy/auth/auth.routes').then(u => u.AuthRoutes)
  },
  {
    canActivate: [langGuard],
    //canMatch: [sessionGuard],
    path: ':lang/admin',
    loadChildren: () => import('@frontend-pharmacy/admin/admin.routes').then(u => u.AdminRoutes)
  },
  {
    canActivate: [langGuard],
    path: ':lang/server-unavailable',
    title: 'COMMON.SERVER_UNAVAILABLE.ROUTER',
    loadComponent: () => import('@frontend-pharmacy/auth/lib/modules/ServerUnavailable/server-unavailable').then(u => u.ServerUnavailable)
  },
  {
    canActivate: [langGuard],
    path: ':lang/**',
    title: 'COMMON.NOT_FOUND.ROUTER',
    loadComponent: () => import('@frontend-pharmacy/auth/lib/modules/NotFound/not-found').then(u => u.NotFound)
  },
  {
    path: '**',
    redirectTo: ':lang'
  }
];

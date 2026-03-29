import { Route } from '@angular/router';
import { OutletAuth } from './lib/modules/_Outlet/outlet-auth';

export const AuthRoutes: Route[] =
[
  {
    path: '',
    title: 'COMMON.ROUTER.INITIAL_LOADER',
    component: OutletAuth,
    children:
    [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sign-in'
      },
      {
        path: 'license-code',
        title: 'LOGIN.ROUTER.LICENSE',
        loadComponent: () => import('./lib/layouts/LicenseCode/layout-license-code').then(a => a.LayoutLicenseCode)
      },
      {
        path: 'license-success',
        title: 'LOGIN.ROUTER.LICENSE',
        loadComponent: () => import('./lib/layouts/LicenseSuccess/layout-license-success').then(a => a.LayoutLicenseSuccess)
      },
      {
        path: 'license-details',
        title: 'LOGIN.ROUTER.LICENSE',
        loadComponent: () => import('./lib/layouts/LicenseDetails/layout-license-details').then(a => a.LayoutLicenseDetails)
      },
      {
        path: 'license-device-code',
        title: 'LOGIN.ROUTER.LICENSE',
        loadComponent: () => import('./lib/layouts/LicenseDeviceCode/layout-license-device-code').then(a => a.LayoutLicenseDeviceCode)
      },
      {
        path: 'license-device-success',
        title: 'LOGIN.ROUTER.LICENSE',
        loadComponent: () => import('./lib/layouts/LicenseDeviceSuccess/layout-license-device-success').then(a => a.LayoutLicenseDeviceSuccess)
      },
      {
        path: 'sign-in',
        title: 'LOGIN.ROUTER.SIGN_IN',
        loadComponent: () => import('./lib/layouts/SignIn/layout-sign-in').then(a => a.LayoutSignIn)
      }
    ]
  }
];

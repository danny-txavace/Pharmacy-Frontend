import { Route } from '@angular/router';
import { Outlet } from './lib/modules/_Outlet/outlet';
import { Dashboard } from './lib/modules/Dashboard/dashboard';

export const AdminRoutes: Route[] =
[
  {
    path: '',
    component: Outlet,
    children:
    [
      {
        path: '',
        pathMatch: 'full',
        //redirectTo: 'dashboard'
        redirectTo: 'pos'
      },
      {
        path: 'dashboard',
        title: 'ADMIN.ROUTER.DASHBOARD',
        component: Dashboard
      },
      {
        path: 'pos',
        title: 'ADMIN.ROUTER.POS',
        loadComponent: () => import('./lib/modules/POS/point-of-sales').then(a => a.PointOfSales)
      },
      {
        path: 'cash_register',
        title: 'ADMIN.ROUTER.CASH_REGISTER',
        loadComponent: () => import('./lib/modules/CashRegister/cash-register').then(a => a.CashRegister)
      },
      {
        path: 'sales',
        title: 'ADMIN.ROUTER.SALES',
        loadComponent: () => import('./lib/modules/Sales/module-sales').then(a => a.ModuleSales)
      },
      {
        path: 'stock',
        title: 'ADMIN.ROUTER.STOCK',
        loadComponent: () => import('./lib/modules/Stock/module-stock').then(a => a.ModuleStock)
      },
      {
        path: 'items',
        title: 'ADMIN.ROUTER.ITEMS',
        loadComponent: () => import('./lib/modules/Items/module-items').then(a => a.ModuleItems)
      },

      // Financial Management
      {
        path: 'financial-acc_payable',
        title: 'ADMIN.ROUTER.FINANCIAL.ACCOUNTS_PAYABLE',
        loadComponent: () => import('./lib/modules/Financials/AccPayable/financial-acc-payable').then(a => a.FinancialAccPayable)
      },
      {
        path: 'financial-acc_receivable',
        title: 'ADMIN.ROUTER.FINANCIAL.ACCOUNTS_RECEIVABLE',
        loadComponent: () => import('./lib/modules/Financials/AccReceivable/financial-acc-receivable').then(a => a.FinancialAccReceivable)
      },
      {
        path: 'financial-acc_balance',
        title: 'ADMIN.ROUTER.FINANCIAL.ACCOUNTS_BALANCE',
        loadComponent: () => import('./lib/modules/Financials/AccBalance/financial-acc-balance').then(a => a.FinancialAccBalance)
      },
      /*{
        path: 'financial-cash_flow',
        title: 'ADMIN.ROUTER.FINANCIAL.CASH_FLOW',
        loadComponent: () => import('./lib/modules/Financials/CashFlow/financial-cash-flow').then(a => a.FinancialCashFlow)
      },*/
      {
        path: 'financial-receipts',
        title: 'ADMIN.ROUTER.FINANCIAL.RECEIPTS',
        loadComponent: () => import('./lib/modules/Financials/Receipts/financial-receipts').then(a => a.FinancialReceipts)
      },
      /*{
        path: 'financial-reports',
        title: 'ADMIN.ROUTER.FINANCIAL.REPORTS',
        loadComponent: () => import('./lib/modules/Financials/Reports/financial-reports').then(a => a.FinancialReports)
      },*/

      // People Management
      {
        path: 'people-customers',
        title: 'ADMIN.ROUTER.PEOPLE.CUSTOMERS',
        loadComponent: () => import('./lib/modules/People/Customers/people-customers').then(a => a.PeopleCustomers)
      },
      {
        path: 'people-suppliers',
        title: 'ADMIN.ROUTER.PEOPLE.SUPPLIERS',
        loadComponent: () => import('./lib/modules/People/Suppliers/people-suppliers').then(a => a.PeopleSuppliers)
      },
      {
        path: 'people-users',
        title: 'ADMIN.ROUTER.PEOPLE.USERS',
        loadComponent: () => import('./lib/modules/People/Users/people-users').then(a => a.PeopleUsers)
      },

      // Others
      {
        path: 'settings',
        loadComponent: () => import('./lib/modules/Settings/settings').then(a => a.Settings),
        children:
        [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'profile'
          },
          {
            path: 'profile',
            title: 'ADMIN.ROUTER.SETTINGS.PROFILE',
            loadComponent: () => import('./lib/layouts/Settings/Profile/layout-setting-profile').then(a => a.LayoutSettingProfile)
          },
          {
            path: 'notifications',
            title: 'ADMIN.ROUTER.SETTINGS.NOTIFICATIONS',
            loadComponent: () => import('./lib/layouts/Settings/Notifications/layout-setting-notification').then(a => a.LayoutSettingNotification)
          },
          {
            path: 'security',
            title: 'ADMIN.ROUTER.SETTINGS.SECURITY',
            loadComponent: () => import('./lib/layouts/Settings/Security/layout-setting-security').then(a => a.LayoutSettingSecurity)
          },
          {
            path: 'apparence',
            title: 'ADMIN.ROUTER.SETTINGS.APPARENCE',
            loadComponent: () => import('./lib/layouts/Settings/Apparence/layout-setting-apparence').then(a => a.LayoutSettingApparence)
          },
          {
            path: 'payment_method',
            title: 'ADMIN.ROUTER.SETTINGS.PAYMENT_METHOD',
            loadComponent: () => import('./lib/layouts/Settings/PaymentMethod/layout-setting-payment-method').then(a => a.LayoutSettingPaymentMethod)
          },
          {
            path: 'other',
            title: 'ADMIN.ROUTER.SETTINGS.OTHERS',
            loadComponent: () => import('./lib/layouts/Settings/Others/layout-setting-other').then(a => a.LayoutSettingOther)
          },
          /*
          {
            path: 'license',
            title: 'ADMIN.ROUTER.SETTINGS.LICENSE',
            loadComponent: () => import('./lib/layouts/Settings/Licence/layout-setting-licence').then(a => a.LayoutSettingLicence)
          }
          */
        ]
      }
    ]
  }
]

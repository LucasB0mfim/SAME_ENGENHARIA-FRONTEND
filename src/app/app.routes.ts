import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { tempTokenGuard } from './core/guards/temp-token.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component')
      .then(c => c.LoginComponent)
  },
  {
    path: 'admission',
    loadComponent: () => import('./pages/admission/admission.component')
      .then(c => c.AdmissionFormComponent),
    canActivate: [tempTokenGuard]
  },
  {
    path: 'invoice',
    loadComponent: () => import('./pages/invoice/invoice.component')
      .then(c => c.InvoiceComponent),
  },
  {
    path: 'workspace',
    loadComponent: () => import('./layout/workspace/workspace.component')
      .then(c => c.WorkspaceComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(c => c.DashboardComponent)
      },
      {
        path: 'reports',
        loadChildren: () => import('./features/reports/reports.routes')
          .then(r => r.REPORTS_ROUTES)
      },
      {
        path: 'human-resources',
        loadChildren: () => import('./features/human-resources/human-resources.routes')
          .then(r => r.HUMAN_RESOURCES_ROUTES)
      },
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

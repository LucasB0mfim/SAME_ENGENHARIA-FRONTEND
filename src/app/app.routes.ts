import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UpdateComponent } from './pages/update/update.component';
import { authGuard } from './core/guard/auth.guard';
import { GeneralComponent } from './components/workspace/general/general.component';
import { TimeSheetComponent } from './components/workspace/time-sheet/time-sheet.component';
import { HumanResourcesComponent } from './components/workspace/human-resources/human-resources.component';
import { TrackingComponent } from './components/workspace/tracking/tracking.component';
import { ReportsComponent } from './components/workspace/reports/reports.component';
import { ExperienceComponent } from './components/workspace/experience/experience.component';
import { RequestsComponent } from './components/workspace/requests/requests.component';
import { ConstructionsComponent } from './components/workspace/constructions/constructions.component';
import { ManageOrdersComponent } from './components/workspace/manage-orders/manage-orders.component';
import { OrderHistoryComponent } from './components/workspace/order-history/order-history.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'update',
    component: UpdateComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: GeneralComponent },
      { path: 'welcome', component: GeneralComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'experience', component: ExperienceComponent },
      { path: 'tracking', component: TrackingComponent },
      { path: 'time-sheet', component: TimeSheetComponent },
      { path: 'human-resources', component: HumanResourcesComponent },
      { path: 'request', component: RequestsComponent },
      { path: 'constructions', component: ConstructionsComponent },
      { path: 'maneger-orders', component: ManageOrdersComponent },
      { path: 'order-history', component: OrderHistoryComponent },
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

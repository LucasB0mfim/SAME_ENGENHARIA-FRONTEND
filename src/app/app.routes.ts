import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { UpdateComponent } from './pages/update/update.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrderComponent } from './components/workspace/order/order.component';
import { ReportsComponent } from './components/workspace/reports/reports.component';
import { GeneralComponent } from './components/workspace/general/general.component';
import { TrackingComponent } from './components/workspace/tracking/tracking.component';
import { TimeSheetComponent } from './components/workspace/time-sheet/time-sheet.component';
import { ExperienceComponent } from './components/workspace/experience/experience.component';
import { ManageOrderComponent } from './components/workspace/manage-order/manage-order.component';
import { ConstructionComponent } from './components/workspace/construction/construction.component';
import { UploadTimesheetComponent } from './components/workspace/upload-timesheet/upload-timesheet.component';
import { HumanResourcesComponent } from './components/workspace/human-resources/human-resources.component';

import { authGuard } from './core/guard/auth.guard';
import { humanResourcesGuard } from './core/guard/human-resources.guard';
import { constructionAccessGuard } from './core/guard/construction-access.guard';
import { OrderDeliveredComponent } from './components/workspace/order-delivered/order-delivered.component';

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
      { path: 'order', component: OrderComponent },
      { path: 'order-delivered', component: OrderDeliveredComponent },
      {
        path: 'constructions',
        component: ConstructionComponent
      },
      {
        path: 'constructions/manage-order',
        component: ManageOrderComponent,
        canActivate: [constructionAccessGuard]
      },
      {
        path: 'human-resources',
        component: HumanResourcesComponent
      },
      {
        path: 'human-resources/upload-timesheet',
        component: UploadTimesheetComponent,
        canActivate: [humanResourcesGuard]
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

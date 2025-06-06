import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { UpdateComponent } from './pages/update/update.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrderComponent } from './components/workspace/order/order.component';
import { FirstLoginComponent } from './pages/first-login/first-login.component';
import { ReportsComponent } from './components/workspace/reports/reports.component';
import { GeneralComponent } from './components/workspace/general/general.component';
import { BenefitComponent } from './components/workspace/benefit/benefit.component';
import { TrackingComponent } from './components/workspace/tracking/tracking.component';
import { TimeSheetComponent } from './components/workspace/time-sheet/time-sheet.component';
import { ExperienceComponent } from './components/workspace/experience/experience.component';
import { IndicatorsComponent } from './components/workspace/indicators/indicators.component';
import { CostCenterComponent } from './components/workspace/cost-center/cost-center.component';
import { ManageOrderComponent } from './components/workspace/manage-order/manage-order.component';
import { ConstructionComponent } from './components/workspace/construction/construction.component';
import { WorkModalityComponent } from './components/workspace/work-modality/work-modality.component';
import { OrderDeliveredComponent } from './components/workspace/order-delivered/order-delivered.component';
import { HumanResourcesComponent } from './components/workspace/human-resources/human-resources.component';
import { UploadExtraDayComponent } from './components/workspace/upload-extra-day/upload-extra-day.component';
import { UploadTimesheetComponent } from './components/workspace/upload-timesheet/upload-timesheet.component';
import { DismissEmployeeComponent } from './components/workspace/dismiss-employee/dismiss-employee.component';

import { tiGuard } from './core/guard/ti.guard';
import { authGuard } from './core/guard/auth.guard';
import { indicatorsGuard } from './core/guard/indicators.guard';
import { humanResourcesGuard } from './core/guard/human-resources.guard';
import { constructionAccessGuard } from './core/guard/construction-access.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
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
    path: 'first-login',
    component: FirstLoginComponent
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
        path: 'human-resources/time-sheet',
        component: TimeSheetComponent,
        canActivate: [humanResourcesGuard]
      },
      {
        path: 'human-resources/upload-timesheet',
        component: UploadTimesheetComponent,
        canActivate: [humanResourcesGuard]
      },
      {
        path: 'human-resources/upload-extraDay',
        component: UploadExtraDayComponent,
        canActivate: [humanResourcesGuard]
      },
      {
        path: 'human-resources/work-modality',
        component: WorkModalityComponent,
        canActivate: [humanResourcesGuard]
      },
      {
        path: 'human-resources/benefit',
        component: BenefitComponent,
        canActivate: [humanResourcesGuard]
      },
      {
        path: 'human-resources/dismiss-employee',
        component: DismissEmployeeComponent,
        canActivate: [humanResourcesGuard]
      },
      {
        path: 'indicators',
        component: IndicatorsComponent
      },
      {
        path: 'indicators/cost-center',
        component: CostCenterComponent,
        canActivate: [indicatorsGuard]
      }
    ]
  }
];

import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { UpdateComponent } from './pages/update/update.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstLoginComponent } from './pages/first-login/first-login.component';
import { ReportsComponent } from './components/workspace/reports/reports.component';
import { GeneralComponent } from './components/workspace/general/general.component';
import { BenefitComponent } from './components/workspace/benefit/benefit.component';
import { TrackingComponent } from './components/workspace/tracking/tracking.component';
import { FinancialComponent } from './components/workspace/financial/financial.component';
import { AdmissionComponent } from './components/workspace/admission/admission.component';
import { TimeSheetComponent } from './components/workspace/time-sheet/time-sheet.component';
import { ExperienceComponent } from './components/workspace/experience/experience.component';
import { CostCenterComponent } from './components/workspace/cost-center/cost-center.component';
import { ResignationComponent } from './components/workspace/resignation/resignation.component';
import { AdmissionFormComponent } from './components/forms/admission-form/admission-form.component';
import { HumanResourcesComponent } from './components/workspace/human-resources/human-resources.component';
import { UploadTimesheetComponent } from './components/workspace/upload-timesheet/upload-timesheet.component';
import { FinancialTrackingComponent } from './components/workspace/financial-tracking/financial-tracking.component';

import { authGuard } from './core/guard/auth.guard';
import { tempTokenGuard } from './core/guard/temp-token.guard';
import { indicatorsGuard } from './core/guard/indicators.guard';
import { humanResourcesGuard } from './core/guard/human-resources.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { TaskComponent } from './components/workspace/task/task.component';
import { TaskFormComponent } from './components/forms/task-form/task-form.component';

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
    path: 'admission',
    component: AdmissionFormComponent,
    canActivate: [tempTokenGuard]
  },
  {
    path: 'task',
    component: TaskFormComponent,
    canActivate: [tempTokenGuard]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
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
        path: 'human-resources/benefit',
        component: BenefitComponent,
        canActivate: [humanResourcesGuard]
      },
      {
        path: 'human-resources/admission',
        component: AdmissionComponent,
        canActivate: [humanResourcesGuard]
      },
      {
        path: 'human-resources/resignation',
        component: ResignationComponent,
        canActivate: [humanResourcesGuard]
      },
      {
        path: 'human-resources/task',
        component: TaskComponent,
        canActivate: [humanResourcesGuard]
      },
      {
        path: 'financial',
        component: FinancialComponent
      },
      {
        path: 'financial/tracking',
        component: FinancialTrackingComponent,
        canActivate: [indicatorsGuard]
      },
      {
        path: 'financial/cost-center',
        component: CostCenterComponent,
        canActivate: [indicatorsGuard]
      }
    ]
  }
];

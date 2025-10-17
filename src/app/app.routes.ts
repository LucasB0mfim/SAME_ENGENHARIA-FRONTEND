import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { UpdateComponent } from './pages/update/update.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstLoginComponent } from './pages/first-login/first-login.component';
import { ReportsComponent } from './components/workspace/reports/reports.component';
import { GeneralComponent } from './components/workspace/general/general.component';
import { BrkComponent } from './components/workspace/human-resources/brk/brk.component';
import { ErrorFormComponent } from './components/forms/error-form/error-form.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { RentalComponent } from './components/workspace/reports/rental/rental.component';
import { TaskComponent } from './components/workspace/human-resources/task/task.component';
import { SuccessFormComponent } from './components/forms/success-form/success-form.component';
import { TrackingComponent } from './components/workspace/reports/tracking/tracking.component';
import { BenefitComponent } from './components/workspace/human-resources/benefit/benefit.component';
import { AdmissionFormComponent } from './components/forms/admission-form/admission-form.component';
import { ExperienceComponent } from './components/workspace/reports/experience/experience.component';
import { EmployeeComponent } from './components/workspace/human-resources/employee/employee.component';
import { CostCenterComponent } from './components/workspace/financial/cost-center/cost-center.component';
import { AdmissionComponent } from './components/workspace/human-resources/admission/admission.component';
import { HumanResourcesComponent } from './components/workspace/human-resources/human-resources.component';
import { TimeSheetComponent } from './components/workspace/human-resources/time-sheet/time-sheet.component';
import { CancellationFormComponent } from './components/forms/cancellation-form/cancellation-form.component';
import { ResignationComponent } from './components/workspace/human-resources/resignation/resignation.component';
import { UploadTimesheetComponent } from './components/workspace/human-resources/upload-timesheet/upload-timesheet.component';
import { CancelTransportComponent } from './components/workspace/human-resources/cancel-transport/cancel-transport.component';

import { authGuard } from './core/guard/auth.guard';
import { tempTokenGuard } from './core/guard/temp-token.guard';
import { humanResourcesGuard } from './core/guard/human-resources.guard';

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
    path: 'benefit-cancellation-form',
    component: CancellationFormComponent,
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: 'success-form',
    component: SuccessFormComponent
  },
  {
    path: 'error-form',
    component: ErrorFormComponent
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
      { path: 'rental', component: RentalComponent },
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
        path: 'human-resources/employees',
        component: EmployeeComponent,
        canActivate: [humanResourcesGuard]
      },
      {
        path: 'human-resources/brk',
        component: BrkComponent,
        canActivate: [humanResourcesGuard]
      },
      {
        path: 'human-resources/task',
        component: TaskComponent,
        canActivate: [humanResourcesGuard]
      },
      {
        path: 'human-resources/cancel-transport',
        component: CancelTransportComponent,
        canActivate: [humanResourcesGuard]
      }
    ]
  }
];

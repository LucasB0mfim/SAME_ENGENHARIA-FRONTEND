import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { UpdateComponent } from './pages/update/update.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstLoginComponent } from './pages/first-login/first-login.component';
import { ReportsComponent } from './components/workspace/reports/reports.component';
import { GeneralComponent } from './components/workspace/general/general.component';
import { BrkComponent } from './components/workspace/human-resources/brk/brk.component';
import { ErrorComponent } from './components/error/error.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { RentalComponent } from './components/workspace/reports/rental/rental.component';
import { TaskComponent } from './components/workspace/human-resources/task/task.component';
import { SuccessComponent } from './components/success/success.component';
import { TrackingComponent } from './components/workspace/reports/tracking/tracking.component';
import { BenefitComponent } from './components/workspace/human-resources/benefit/benefit.component';
import { ExperienceComponent } from './components/workspace/reports/experience/experience.component';
import { EmployeeComponent } from './components/workspace/human-resources/employee/employee.component';
import { AdmissionComponent } from './components/workspace/human-resources/admission/admission.component';
import { HumanResourcesComponent } from './components/workspace/human-resources/human-resources.component';
import { ResignationComponent } from './components/workspace/human-resources/resignation/resignation.component';
import { UploadTimesheetComponent } from './components/workspace/human-resources/upload-timesheet/upload-timesheet.component';

import { authGuard } from './core/guard/auth.guard';
import { tempTokenGuard } from './core/guard/temp-token.guard';
import { humanResourcesGuard } from './core/guard/human-resources.guard';
import { TransportComponent } from './components/workspace/human-resources/transport/transport.component';
import { DisciplinaryMeasureComponent } from './components/workspace/human-resources/disciplinary-measure/disciplinary-measure.component';
import { AdmissionFormComponent } from './components/forms/admission/admission.component';

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
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: 'success-form',
    component: SuccessComponent
  },
  {
    path: 'error-form',
    component: ErrorComponent
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
        path: 'human-resources/transport',
        component: TransportComponent,
        canActivate: [humanResourcesGuard]
      },
      {
        path: 'human-resources/disciplinary-measure',
        component: DisciplinaryMeasureComponent,
        canActivate: [humanResourcesGuard]
      }
    ]
  }
];

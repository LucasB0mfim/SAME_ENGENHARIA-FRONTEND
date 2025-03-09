import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UpdateComponent } from './pages/update/update.component';
import { authGuard } from './guard/auth.guard';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { TimeSheetComponent } from './components/time-sheet/time-sheet.component';
import { HumanResourcesComponent } from './components/human-resources/human-resources.component';

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
      { path: '', component: WelcomeComponent },
      { path: 'welcome', component: WelcomeComponent },
      { path: 'time-sheet', component: TimeSheetComponent },
      { path: 'human-resources', component: HumanResourcesComponent }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

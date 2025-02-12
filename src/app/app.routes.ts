import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'acessar-conta',
    component: LoginComponent
  },
  {
    path: 'atualizar-conta',
    component: CadastroComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];

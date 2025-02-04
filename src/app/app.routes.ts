import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { PrimeiroAcessoComponent } from './components/primeiro-acesso/primeiro-acesso.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'atualizar-conta',
    component: PrimeiroAcessoComponent
  }
];

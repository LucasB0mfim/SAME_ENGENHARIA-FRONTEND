import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { PrimeiroAcessoComponent } from './components/primeiro-acesso/primeiro-acesso.component';
import { HomeComponent } from './components/home/home.component';
import { CarouselComponent } from './components/carousel/carousel/carousel.component';

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
    component: PrimeiroAcessoComponent
  },
  {
    path: 'carousel',
    component: CarouselComponent
  }
];

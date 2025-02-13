import { Component, inject } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  usuario = 'Lucas Bomfim';
  funcao = 'Engenheiro de Software'

  private readonly _loginService = inject(LoginService);

  logout() {
    this._loginService.logout(); // Chama o método de logout
  }
}

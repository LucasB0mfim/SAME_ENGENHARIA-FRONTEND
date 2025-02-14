import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  space: string = '/assets/images/space.png';

  username = 'Carregando...';
  function = 'Carregando...';

  private readonly _dashboardService = inject(DashboardService);
  private readonly _loginService = inject(LoginService);

  ngOnInit() {
    this.employeeData();
  };

  employeeData() {
    this._dashboardService.getEmployeeData().subscribe({
      next: (response) => {
        this.username = response.name;
        this.function = response.function
      },
      error: (error) => {
        console.error('Erro ao carregar informações do colaborador:', error);
        this.username = 'Indefinido';
        this.function = 'Indefinido';
      }
    });
  };

  logout() {
    this._loginService.logout();
  };
}

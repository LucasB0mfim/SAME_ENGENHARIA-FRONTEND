import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { DashboardService } from '../../services/dashboard.service';
import { MatIconModule } from '@angular/material/icon';
import { MenuDashboardComponent } from '../../components/menu-dashboard/menu-dashboard.component';
import { HeaderDashboardComponent } from '../../components/header-dashboard/header-dashboard.component';

interface EmployeeData {
  name: string;
  username: string;
  function: string;
  avatar: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MenuDashboardComponent,
    HeaderDashboardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  isDarkTheme: boolean = false
  isMenuOpen: boolean = false;

  name: string = 'Carregando';
  username: string = 'Carregando...';
  function: string = 'Carregando...';
  avatar: string = 'assets/images/avatarIcon.png';

  private readonly _dashboardService = inject(DashboardService);
  private readonly _loginService = inject(LoginService);

  constructor() {
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
  }

  ngOnInit() {
    this.loadEmployeeData();
  }

  loadEmployeeData(): void {
    this._dashboardService.getEmployeeData().subscribe({
      next: (response: EmployeeData) => {
        this.name = response.name;
        this.username = response.username;
        this.function = response.function;
        this.avatar = response.avatar;
      },
      error: (error) => {
        console.error('Erro ao carregar informações do colaborador:', error);
        this.name = 'Indefinido';
        this.username = 'Indefinido';
        this.function = 'Indefinido';
        this.avatar = 'Indefinido';
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    this.applyTheme();
    this.isMenuOpen = false;
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
  }

  logout(): void {
    this.isMenuOpen = false;
    this._loginService.logout();
  }
}

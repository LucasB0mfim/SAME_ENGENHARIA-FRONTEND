import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { DashboardService } from '../../services/dashboard.service';

interface EmployeeData {
  name: string;
  username: string;
  function: string;
  avatar: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // Properties
  dashboardIconDark: string = 'assets/images/dashboardDark.png';
  dashboardIconLight: string = 'assets/images/dashboardLight.png';

  indicatorIconDark: string = 'assets/images/indicatorDark.png';
  indicatorIconLight: string = 'assets/images/indicatorLight.png';

  sheetsIconDark: string = 'assets/images/sheetsDark.png';
  sheetsIconLight: string = 'assets/images/sheetsLight.png';

  sheetsIcon: string = '';
  indicatorIcon: string = '';
  dashboardIcon: string = '';

  isDarkTheme: boolean = false;

  searchQuery: string = '';
  isUserMenuOpen: boolean = false;

  // User data
  name: string = 'Carregando';
  username: string = 'Carregando...';
  function: string = 'Carregando...';
  avatar: string = '...'

  // Services
  private readonly _dashboardService = inject(DashboardService);
  private readonly _loginService = inject(LoginService);

  constructor() {
    // Inicializa o tema baseado na preferência salva
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
    this.updateDashboardIcon(); // Atualiza os ícones ao inicializar o componente
  }

  ngOnInit() {
    this.loadEmployeeData();
  }

  // Methods
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

  onSearch(): void {
    if (this.searchQuery.length >= 3) {
      console.log('Searching for:', this.searchQuery);
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    this.applyTheme();
    this.updateDashboardIcon(); // Atualiza os ícones ao mudar o tema
    this.isUserMenuOpen = false;
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
  }

  private updateDashboardIcon(): void {
    this.dashboardIcon = this.isDarkTheme ? this.dashboardIconLight : this.dashboardIconDark;
    this.indicatorIcon = this.isDarkTheme ? this.indicatorIconLight : this.indicatorIconDark;
    this.sheetsIcon = this.isDarkTheme ? this.sheetsIconLight : this.sheetsIconDark;
  }

  logout(): void {
    this.isUserMenuOpen = false;
    this._loginService.logout();
  }
}

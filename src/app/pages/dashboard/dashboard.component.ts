import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../core/services/login.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ThemeService } from '../../core/services/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../../components/workspace/sidebar/menu.component';
import { HeaderComponent } from '../../components/workspace/header/header.component';
import { IEmployeeResponse } from '../../core/interfaces/employee-response.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  isMenuOpen: boolean = false;
  isDarkTheme: boolean = false;
  hasCustomAvatar: boolean = false;

  avatarIcon: string = '';
  avatarIconDark: string = 'assets/images/avatarIconDark.png';
  avatarIconLight: string = 'assets/images/avatarIconLight.png';

  name: string = 'Carregando';
  username: string = 'Carregando...';
  avatar: string = '';

  private readonly _dashboardService = inject(DashboardService);
  private readonly _loginService = inject(LoginService);
  private readonly _themeService = inject(ThemeService);

  constructor() {
    // Obter o tema inicial do localStorage
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    this.toggleIconTheme();
    this.applyTheme();
  }

  ngOnInit() {
    this.loadEmployeeData();
  }

  loadEmployeeData(): void {
    this._dashboardService.findAll().subscribe({
      next: (response: IEmployeeResponse) => {
        const employee = response.employee;
        this.name = employee.name;
        this.username = employee.username || employee.name;
        this.hasCustomAvatar = !!employee.avatar;
        this.avatar = employee.avatar || this.avatarIcon;
      },
      error: (error) => {
        console.error('Erro ao carregar informações do colaborador:', error);
        this.name = 'error';
        this.username = 'error';
        this.hasCustomAvatar = false;
        this.avatar = this.avatarIcon;
      }
    });
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;

    // Atualizar o tema via serviço (isso também atualiza o localStorage)
    this._themeService.setThemeState(this.isDarkTheme);

    this.applyTheme();
    this.toggleIconTheme();
    this.isMenuOpen = false;

    if (!this.hasCustomAvatar) {
      this.avatar = this.avatarIcon;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  private toggleIconTheme(): void {
    this.avatarIcon = this.isDarkTheme ? this.avatarIconLight : this.avatarIconDark;
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
  }

  logout(): void {
    this.isMenuOpen = false;
    this._loginService.logout();
  }
}

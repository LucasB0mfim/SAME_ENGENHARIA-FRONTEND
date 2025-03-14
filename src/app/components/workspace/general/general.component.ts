import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { TitleService } from '../../../core/services/title.service';
import { DashboardService } from '../../../core/services/dashboard.service';

interface EmployeeData {
  name: string;
}

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit {
  ilustration: string = 'assets/images/peoples.png';
  username: string = 'Carregando...';

  private readonly _dashboardService = inject(DashboardService);
  private _titleService = inject(TitleService);

  backgroundStyle: string = '';
  textColor: string = '';

  ngOnInit() {
    this.applyDayPeriodStyle();
    this.loadEmployeeData();
    this._titleService.setTitle('Dashboard')
  }

  loadEmployeeData(): void {
    this._dashboardService.findAll().subscribe({
      next: (response) => {
        this.username = response.employee.username;
      },
      error: (error) => {
        console.error(error);
        this.username = 'Colaborador';
      }
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Bom dia";
    } else if (hour < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  }

  applyDayPeriodStyle(): void {
    const hour = new Date().getHours();

    if (hour < 12) {
      this.backgroundStyle = 'linear-gradient(to right, #FFFAE3, #D9E8FF)';
      this.textColor = '#3b3b3b';
    } else if (hour < 18) {
      this.backgroundStyle = 'linear-gradient(to right, #FFB547, #FFD97D)';
      this.textColor = '#3b3b3b';
    } else {
      this.backgroundStyle = 'linear-gradient(to right, #4A6D8C, #2C3E50)';
      this.textColor = '#FFF';
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { TitleService } from '../../../core/services/title.service';
import { DashboardService } from '../../../core/services/dashboard.service';

interface DashboardData {
  employee: {
    username: string;
  };
}

interface BirthdayPerson {
  name: string;
  avatarUrl?: string;
}

interface Notice {
  title: string;
  content: string;
}

enum DayPeriod {
  MORNING,
  AFTERNOON,
  EVENING
}

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit {
  // Propriedades públicas
  ilustration = 'assets/images/peoples.png';
  username = 'Carregando...';
  backgroundStyle = '';
  textColor = '';

  // Dados mockados (ideal seria vir do serviço)
  birthdayPeople: BirthdayPerson[] = [
    { name: 'João' },
    { name: 'Maria' },
    { name: 'Pedro' },
    { name: 'Ana' },
    { name: 'Carlos' }
  ];

  notices: Notice[] = [
    {
      title: 'Reunião - Sexta Feira',
      content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. A amet officiis vero.'
    },
    {
      title: 'Treinamento - Segunda Feira',
      content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. A amet officiis vero.'
    }
  ];

  // Quick access links
  quickAccessLinks = [
    {
      route: '/dashboard/experience',
      icon: 'date_range',
      label: 'Experiência'
    },
    {
      route: '/dashboard/tracking',
      icon: 'edit_document',
      label: 'OC\'S'
    },
    {
      route: '/dashboard/request',
      icon: 'local_shipping',
      label: 'Meus Pedidos'
    }
  ];

  // Serviços injetados
  private readonly dashboardService = inject(DashboardService);
  private readonly titleService = inject(TitleService);

  ngOnInit(): void {
    this.applyDayPeriodStyle();
    this.loadEmployeeData();
    this.titleService.setTitle('Dashboard');
  }

  getGreeting(): string {
    const period = this.getCurrentDayPeriod();

    switch (period) {
      case DayPeriod.MORNING:
        return 'Bom dia';
      case DayPeriod.AFTERNOON:
        return 'Boa tarde';
      case DayPeriod.EVENING:
        return 'Boa noite';
      default:
        return 'Olá';
    }
  }

  private loadEmployeeData(): void {
    this.dashboardService.findAll().subscribe({
      next: (response: DashboardData) => {
        this.username = response.employee.username;
      },
      error: (error) => {
        console.error('Erro ao carregar dados do colaborador:', error);
        this.username = 'Colaborador';
      }
    });
  }

  private getCurrentDayPeriod(): DayPeriod {
    const hour = new Date().getHours();

    if (hour < 12) {
      return DayPeriod.MORNING;
    } else if (hour < 18) {
      return DayPeriod.AFTERNOON;
    } else {
      return DayPeriod.EVENING;
    }
  }

  private applyDayPeriodStyle(): void {
    const period = this.getCurrentDayPeriod();

    switch (period) {
      case DayPeriod.MORNING:
        this.backgroundStyle = 'linear-gradient(to right, #FFFAE3, #D9E8FF)';
        this.textColor = '#3b3b3b';
        break;
      case DayPeriod.AFTERNOON:
        this.backgroundStyle = 'linear-gradient(to right, #FFB547, #FFD97D)';
        this.textColor = '#3b3b3b';
        break;
      case DayPeriod.EVENING:
        this.backgroundStyle = 'linear-gradient(to right, #4A6D8C, #2C3E50)';
        this.textColor = '#FFF';
        break;
    }
  }
}

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

import { TitleService } from '../../../core/services/title.service';
import { EmployeeService } from '../../../core/services/employee.service';

interface DashboardData {
  colaboradores_ativos?: number;
  colaboradores_ferias?: number;
  colaboradores_demitidos?: number;
  total_colaboradores?: number;
}

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class GeneralComponent implements OnInit, OnDestroy {

  private readonly _titleService = inject(TitleService);
  private readonly _employeeService = inject(EmployeeService);

  dashboardData: DashboardData = {};
  selectedFeeling: string | null = null;
  showFeedbackMessage: boolean = false;
  private feedbackTimeout?: number;

  ngOnInit(): void {
    this._titleService.setTitle('Dashboard');
    this.loadDashboard();
  }

  loadDashboard(): void {
    this._employeeService.dashboard().subscribe({
      next: (res) => {
        this.dashboardData = res.result;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      }
    });
  }

  setFeeling(feeling: string): void {
    this.selectedFeeling = feeling;
    this.showFeedbackMessage = true;

    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
    }

    this.feedbackTimeout = window.setTimeout(() => {
      this.showFeedbackMessage = false;
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
    }
  }
}

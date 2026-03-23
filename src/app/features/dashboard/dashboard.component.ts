import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit, inject } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

import { TitleService } from '../../core/services/title.service';
import { EmployeeService } from '../human-resources/services/employee.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('staggerIn', [
      transition(':enter', [
        query('.dash__card', [
          style({ opacity: 0, transform: 'translateY(12px)' }),
          stagger(45, [
            animate('300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {

  private readonly _titleService = inject(TitleService);
  private readonly _employeeService = inject(EmployeeService);

  dashboardData: any = {};

  ngOnInit(): void {
    this._titleService.setTitle('Dashboard');
    this._employeeService.dashboard().subscribe({
      next: (res) => { this.dashboardData = res.result; },
      error: (err) => { console.error(err); }
    });
  }
}

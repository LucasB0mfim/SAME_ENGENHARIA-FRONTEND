import { finalize } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../../core/services/title.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { TimesheetService } from '../../../../core/services/timesheet.service';

@Component({
  selector: 'app-time-sheet',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './time-sheet.component.html',
  styleUrl: './time-sheet.component.scss'
})
export class TimeSheetComponent implements OnInit {
  private readonly _titleService = inject(TitleService);
  private readonly _timesheetService = inject(TimesheetService);
  private readonly _employeesService = inject(EmployeeService);

  items: any[] = [];
  employees: any = {};
  selectedEmployee: string = '';

  isEmpty: boolean = true;
  isLoading: boolean = false;
  isSearching: boolean = false;

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this._titleService.setTitle('Controle de Ponto');
    this.findEmployeesName();
  }

  findEmployeesName(): void {
    this._employeesService.findActiveNames().subscribe({
      next: (res) => {
        this.employees = res.result;
      },
      error: (error) => {
        console.log("Não foi possível bucar colaboradores: ", error);
      }
    });
  }

  findSheet(): void {
    this.items = [];
    this.isEmpty = false;
    this.isSearching = true;

    this._timesheetService.findSheetByName(this.selectedEmployee)
    .pipe(finalize(() => this.isSearching = false))
    .subscribe({
      next: (res) => {
        this.items = res.result;
        this.isEmpty = this.items.length === 0;
        this.setMessage(res.message, 'success');
      },
      error: (error) => {
        this.isEmpty = true;
        this.setMessage(error.error.message, 'error');
        console.log("Erro ao buscar batida(s) do colaborador: ", error);
      }
    });
  }

  formateDate(date: string) {
    if (!date) return 'N/A'
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  setMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  }
}

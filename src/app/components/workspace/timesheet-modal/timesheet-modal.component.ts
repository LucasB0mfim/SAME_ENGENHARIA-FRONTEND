import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ITimesheetRecord } from '../../../core/interfaces/timesheet-response.interface';
import { TimesheetReportService } from '../../../core/services/timesheet-report.service';

@Component({
  selector: 'app-timesheet-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './timesheet-modal.component.html',
  styleUrl: './timesheet-modal.component.scss'
})
export class TimesheetModalComponent implements OnInit {
  private readonly _timesheetService = inject(TimesheetReportService);

  employeeName: string = '';
  timesheetRecords: ITimesheetRecord[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<TimesheetModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeName: string }
  ) {
    this.employeeName = data.employeeName;
  }

  ngOnInit(): void {
    this.loadTimesheetData();
  }

  loadTimesheetData(): void {
    this.isLoading = true;
    this.error = null;

    this._timesheetService.getEmployeeTimesheet(this.employeeName).subscribe({
      next: (response) => {
        this.timesheetRecords = response.records;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados de ponto:', err);
        this.error = 'Ocorreu um erro ao carregar os registros de ponto. Por favor, tente novamente.';
        this.isLoading = false;
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}

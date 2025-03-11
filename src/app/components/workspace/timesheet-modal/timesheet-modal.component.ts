import { Component, Inject, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { ITimesheetRecord } from '../../../core/interfaces/timesheet-response.interface';
import { TimesheetReportService } from '../../../core/services/timesheet-report.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-timesheet-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './timesheet-modal.component.html',
  styleUrl: './timesheet-modal.component.scss'
})
export class TimesheetModalComponent implements OnInit, OnDestroy {
  private readonly _timesheetService = inject(TimesheetReportService);
  private _subscription: Subscription = new Subscription();

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

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  loadTimesheetData(): void {
    this.isLoading = true;
    this.error = null;

    const subscription = this._timesheetService.getEmployeeTimesheet(this.employeeName).subscribe({
      next: (response) => {
        this.timesheetRecords = response.records;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load timesheet data:', error);
        this.error = 'Ocorreu um erro ao carregar os registros de ponto. Por favor, tente novamente.';
        this.isLoading = false;
      }
    });

    this._subscription.add(subscription);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}

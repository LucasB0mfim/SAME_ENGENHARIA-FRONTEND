import { Component, Inject, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { ITimesheetRecord } from '../../../core/interfaces/timesheet-response.interface';
import { TimesheetReportService } from '../../../core/services/timesheet-report.service';
import { MatIconModule } from '@angular/material/icon';
import { TimeSheetService } from '../../../core/services/time-sheet.service';

@Component({
  selector: 'app-timesheet-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './timesheet-modal.component.html',
  styleUrl: './timesheet-modal.component.scss'
})
export class TimesheetModalComponent implements OnInit, OnDestroy {
  private readonly _timesheetReportService = inject(TimesheetReportService);
  private readonly _timeSheetService = inject(TimeSheetService);
  private _subscription: Subscription = new Subscription();

  employeeName: string = '';
  timesheetRecords: ITimesheetRecord[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<TimesheetModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      employeeName: string,
      records?: ITimesheetRecord[],
      startDate?: string,
      endDate?: string,
      employeeId?: string,
      status?: string,
      abono?: string
    }
  ) {
    this.employeeName = data.employeeName;
  }

  ngOnInit(): void {
    // Se os registros já foram fornecidos, use-os diretamente
    if (this.data.records && this.data.records.length > 0) {
      this.timesheetRecords = this.data.records;
      this.isLoading = false;
    } else {
      // Caso contrário, carregue-os do serviço
      this.loadTimesheetData();
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  loadTimesheetData(): void {
    this.isLoading = true;
    this.error = null;

    // Utiliza o serviço atualizado com os filtros adicionais
    const subscription = this._timeSheetService.getEmployeeTimesheet(
      this.employeeName,
      this.data.startDate,
      this.data.endDate,
      this.data.status,
      this.data.abono
    ).subscribe({
      next: (response) => {
        this.timesheetRecords = response.records;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.error = 'Erro ao carregar os dados. Tente novamente mais tarde.';
        this.isLoading = false;
      }
    });

    this._subscription.add(subscription);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}

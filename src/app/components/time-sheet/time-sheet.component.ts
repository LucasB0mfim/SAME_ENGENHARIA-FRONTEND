import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSheetService } from '../../services/time-sheet.service';

@Component({
  selector: 'app-time-sheet',
  imports: [CommonModule],
  templateUrl: './time-sheet.component.html',
  styleUrl: './time-sheet.component.scss'
})
export class TimeSheetComponent implements OnInit {
  records: any[] = [];

  private readonly _timeSheetService = inject(TimeSheetService);

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this._timeSheetService.records().subscribe({
      next: (data) => {
        this.records = data;
      },
      error: (err) => {
        console.error('Erro ao carregar registros:', err);
      }
    });
  }
}

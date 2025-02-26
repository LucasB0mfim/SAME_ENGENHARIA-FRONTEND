import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSheetService } from '../../services/time-sheet.service';
import { ITimeSheetResponse, ITimeSheetRecord } from '../../interfaces/time-sheet.interface';

@Component({
  selector: 'app-time-sheet',
  imports: [CommonModule],
  templateUrl: './time-sheet.component.html',
  styleUrl: './time-sheet.component.scss'
})
export class TimeSheetComponent implements OnInit {

  private readonly _timeSheetService = inject(TimeSheetService);

  timeSheets: ITimeSheetRecord[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this._timeSheetService.findAll().subscribe({
      next: (response: ITimeSheetResponse) => {
        this.timeSheets = response.records;
      },
      error: (err) => {
        console.error('Erro ao carregar os dados:', err);
      }
    });
  }
}

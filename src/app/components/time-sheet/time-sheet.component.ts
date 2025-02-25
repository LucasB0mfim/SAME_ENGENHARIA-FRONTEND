import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSheetService } from '../../services/time-sheet.service';
import { ITimeSheetResponse } from '../../interfaces/time-sheet.interface';

@Component({
  selector: 'app-time-sheet',
  imports: [CommonModule],
  templateUrl: './time-sheet.component.html',
  styleUrl: './time-sheet.component.scss'
})
export class TimeSheetComponent implements OnInit {

  private readonly _timeSheetService = inject(TimeSheetService);

  id: string = '';
  name: string = '';
  time: string = '';
  miss: string = '';
  justification: string = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this._timeSheetService.findAll().subscribe({
      next: (response: ITimeSheetResponse) => {
        const timeSheet = response.records;
        this.id = timeSheet.CHAPA;
        this.name = timeSheet.NOME;
        this.time = timeSheet['JORNADA REALIZADA'];
        this.miss = timeSheet.FALTA
        this.justification = timeSheet['EVENTO ABONO']
      }
    })
  }
}

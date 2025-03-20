import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TitleService } from '../../../core/services/title.service';
import { RequestService } from '../../../core/services/request.service';

import { IRequestRecord, IRequestResponse } from '../../../core/interfaces/request-response.interface';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export class RequestsComponent implements OnInit {

  expandedIndex: number = -1;
  records: IRequestRecord[]= [];
  allRecords: IRequestRecord[] = [];

  private _titleService = inject(TitleService);
  private _requestService = inject(RequestService);

  ngOnInit() {
    this.find();
    this._titleService.setTitle('Recebimento de Material')
  }

  find() {
    this._requestService.find().subscribe({
      next: (data) => {
        this.records = data.request;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  toggleExpand(index: number): void {
    if (this.expandedIndex === index) {
      this.expandedIndex = -1; // Fecha o item
    } else {
      this.expandedIndex = index; // Abre o item clicado
    }
  }
}

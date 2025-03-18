import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { TitleService } from '../../../core/services/title.service';
import { TrackingService } from '../../../core/services/tracking.service';

import { ITrackingRecord } from '../../../core/interfaces/tracking-response.interface';

@Component({
  selector: 'app-tracking',
  imports: [CommonModule, FormsModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent {

  records: ITrackingRecord[] = [];
  allRecords: ITrackingRecord[] = [];

  idName: string = '';
  ocName: string = '';
  materialName: string = '';
  centroCustoName: string = '';

  private _titleService = inject(TitleService);
  private readonly _trackingService = inject(TrackingService);

  ngOnInit(): void {
    this.load();
    this._titleService.setTitle('Rastreamento de Pedidos')
  }

  load(): void {
    this._trackingService.findAll().subscribe({
      next: (data) => {
        this.records = data.tracking;
        this.allRecords = [...data.tracking];
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  filter() {
    let filteredRecords = [...this.allRecords];

    if (this.centroCustoName) {
      const inputValue = this.centroCustoName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.CENTRO_CUSTO && data.CENTRO_CUSTO.toLowerCase().includes(inputValue)
      )
    }

    if (this.idName) {
      const inputValue = this.idName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.ID && data.ID.toLowerCase().includes(inputValue)
      )
    }

    if (this.ocName) {
      const inputValue = this.ocName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.NUMERO_OC && data.NUMERO_OC.toLowerCase().includes(inputValue)
      )
    }

    if (this.materialName) {
      const inputValue = this.materialName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.MATERIAL && data.MATERIAL.toLowerCase().includes(inputValue)
      )
    }

    this.records = filteredRecords;
  }

  searchCentroCusto() {
    this.filter();
  }

  searchId() {
    this.filter();
  }

  searchOc() {
    this.filter();
  }

  searchMaterial() {
    this.filter();
  }
}

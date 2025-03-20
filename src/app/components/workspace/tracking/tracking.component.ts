import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TitleService } from '../../../core/services/title.service';
import { TrackingService } from '../../../core/services/tracking.service';

import { ITrackingRecord } from '../../../core/interfaces/tracking-response.interface';

@Component({
  selector: 'app-tracking',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent {

  centroCusto: string[] = [];
  expandedIndex: number = -1; // Nenhum item expandido inicialmente
  isSelectOpen: boolean = false;
  records: ITrackingRecord[] = [];
  allRecords: ITrackingRecord[] = [];

  idName: string = '';
  ocName: string = '';
  materialName: string = '';
  movimentoName: string = '';
  centroCustoName: string = '';

  private _titleService = inject(TitleService);
  private readonly _trackingService = inject(TrackingService);

  ngOnInit(): void {
    this.load();
    this._titleService.setTitle('Acompanhar Pedidos')
  }

  load(): void {
    this._trackingService.findAll().subscribe({
      next: (data) => {
        this.records = data.tracking;
        this.allRecords = [...data.tracking];
        this.excludeDuplicates();
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  excludeDuplicates() {
    const uniqueValues = new Set<string>();

    this.allRecords.forEach(record => {
      uniqueValues.add(record.CENTRO_CUSTO);
    });

    this.centroCusto = Array.from(uniqueValues).sort();
  }

  // Método para expandir/contrair um item
  toggleExpand(index: number): void {
    if (this.expandedIndex === index) {
      this.expandedIndex = -1; // Fecha o item
    } else {
      this.expandedIndex = index; // Abre o item clicado
    }
  }

  getStatusColor(data: ITrackingRecord): string {
    if (data.APROVACAO_OC) {
      return '#32CD32'
    } else {
      return '#0000FF'
    }
  }

  filter() {
    let filteredRecords = [...this.allRecords];

    if (this.centroCustoName) {
      filteredRecords = filteredRecords.filter(data =>
        data.CENTRO_CUSTO === this.centroCustoName
      );
    }

    if (this.materialName) {
      const inputValue = this.materialName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.MATERIAL && data.MATERIAL.toLowerCase().includes(inputValue)
      );
    }

    if (this.movimentoName) {
      const inputValue = this.movimentoName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.MOVIMENTO && data.MOVIMENTO.toLowerCase().includes(inputValue)
      );
    }

    if (this.idName) {
      const inputValue = this.idName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.ID && data.ID.toLowerCase().includes(inputValue)
      );
    }

    if (this.ocName) {
      const inputValue = this.ocName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.NUMERO_OC && data.NUMERO_OC.toLowerCase().includes(inputValue)
      );
    }

    this.records = filteredRecords;
    this.isSelectOpen = false;
  }

  searchCentroCusto() {
    this.filter();
  }

  searchMaterial() {
    this.filter();
  }

  searchMovimento() {
    this.filter();
  }

  searchId() {
    this.filter();
  }

  searchOc() {
    this.filter();
  }

  toggleSelect() {
    // O mousedown ocorre antes do select realmente abrir ou fechar
    // Então invertemos o estado atual
    setTimeout(() => {
      this.isSelectOpen = !this.isSelectOpen;
    }, 0);
  }

  resetSelectIcon() {
    // Quando o select perde o foco (clique fora), o ícone retorna à posição original
    this.isSelectOpen = false;
  }
}

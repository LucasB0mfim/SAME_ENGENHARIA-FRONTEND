import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';

import { TitleService } from '../../../core/services/title.service';
import { TrackingService } from '../../../core/services/tracking.service';

import { ITrackingInfo } from '../../../core/interfaces/tracking-response.interface';

@Component({
  selector: 'app-tracking',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent implements OnInit {
  private __titleService = inject(TitleService);
  private readonly __trackingService = inject(TrackingService);

  originalOrder: ITrackingInfo[] = [];
  order: ITrackingInfo[] = [];
  expandedCard: string | null = null;
  centrosCustoUnicos: string[] = [];

  idField: string = '';
  ocField: string = '';
  isSelectOpen: boolean = false;
  centroCustoField: string = '';
  fornecedorField: string = '';
  movimentoField: string = '';

  ngOnInit() {
    this.__titleService.setTitle('Rastreamento de Pedidos');
    this.getID();
  }

  getID() {
    this.__trackingService.findAll().subscribe({
      next: (data) => {
        this.originalOrder = data.tracking;
        this.order = [...this.originalOrder];
        this.removeDuplicate();
      },
      error: (error) => console.error('Não foi possível carregar os pedidos:', error)
    });
  }

  removeDuplicate() {
    const centrosCustoSet = new Set<string>();

    this.originalOrder.forEach(item => {
      if (item.centro_custo && item.centro_custo.trim() !== '') {
        centrosCustoSet.add(item.centro_custo);
      }
    });

    this.centrosCustoUnicos = Array.from(centrosCustoSet).sort();
  }

  toggleCard(cardID: string) {
    this.expandedCard = (this.expandedCard === cardID) ? null : cardID;
  }

  applyFilters() {
    // Pedidos originais
    let filteredData = [...this.originalOrder];

    if (this.idField && this.idField.trim() !== '') {
      filteredData = filteredData.filter(item =>
        item.id.toLowerCase().includes(this.idField.toLowerCase())
      );
    }

    if (this.ocField && this.ocField.trim() !== '') {
      filteredData = filteredData.filter(item =>
        item.numero_oc && item.numero_oc.toLowerCase().includes(this.ocField.toLowerCase())
      );
    }

    if (this.centroCustoField && this.centroCustoField.trim() !== '') {
      filteredData = filteredData.filter(item =>
        item.centro_custo === this.centroCustoField
      );
    }

    if (this.fornecedorField && this.fornecedorField.trim() !== '') {
      filteredData = filteredData.filter(item =>
        item.fornecedor?.toLowerCase().includes(this.fornecedorField.toLowerCase())
      );
    }

    if (this.movimentoField && this.movimentoField.trim() !== '') {
      filteredData = filteredData.filter(item =>
        item.movimento?.toLowerCase().includes(this.movimentoField.toLowerCase())
      );
    }

    // Atualizamos os dados filtrados
    this.order = filteredData;
  }

  toggleSelect() {
    setTimeout(() => {
      this.isSelectOpen = !this.isSelectOpen;
    }, 0);
  }

  resetSelectIcon() {
    this.isSelectOpen = false;
  }
}

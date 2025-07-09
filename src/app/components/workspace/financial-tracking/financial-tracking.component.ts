import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../core/services/title.service';
import { FinancialService } from '../../../core/services/financial.service';

@Component({
  selector: 'app-financial-tracking',
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './financial-tracking.component.html',
  styleUrl: './financial-tracking.component.scss'
})
export class FinancialTrackingComponent implements OnInit {
  private __titleService = inject(TitleService);
  private readonly __financialService = inject(FinancialService);

  originalOrder: any[] = [];
  order: any[] = [];
  centrosCustoUnicos: string[] = [];
  isLoading: boolean = true;
  isVoid: boolean = false;

  idField: string = '';
  centroCustoField: string = '';

  ngOnInit() {
    this.__titleService.setTitle('Rastrear ID');
    this.getID();
  }

  getID() {
    this.__financialService.findByID().subscribe({
      next: (data) => {
        this.originalOrder = data.result;
        this.order = [...this.originalOrder];

        this.removeDuplicate();

        this.isLoading = false;
        if (this.order.length === 0) this.isVoid = true;
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

  applyFilters() {
    let filteredData = [...this.originalOrder];

    // Filtrar por centro de custo
    if (this.centroCustoField && this.centroCustoField.trim() !== '') {
      filteredData = filteredData.filter(item =>
        item.centro_custo === this.centroCustoField
      );
    }

    // Filtrar por id
    if (this.idField && this.idField.trim() !== '') {
      filteredData = filteredData.filter(item =>
        String(item.id).includes(this.idField.trim())
      );
    }

    this.order = filteredData;
    this.isVoid = this.order.length === 0;
  }

  formatCurrency(value: number): string {
    if (!value) return '0,00'

    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}

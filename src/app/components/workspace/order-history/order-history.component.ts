import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { OrderService } from '../../../core/services/order.service';

import { IOrderListRequest, IOrderRecord } from '../../../core/interfaces/order-response.interface';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent implements OnInit {
  valor: string = '';
  fornecedor: string = '';
  centro_custo: string = '';
  ordem_compra: string = '';

  expandedIndex: number = -1;
  groupedRecords: IOrderListRequest[] = [];
  allRecords: IOrderRecord[] = [];
  activeView: { [key: number]: string } = {};

  private _titleService = inject(TitleService);
  private _orderService = inject(OrderService);

  ngOnInit() {
    this.find();
    this._titleService.setTitle('Histórico de Pedidos');
  }

  find() {
    this._orderService.find().subscribe({
      next: (data) => {
        this.allRecords = data.order;
        this.groupByOC();

        this.groupedRecords.forEach((group, index) => {
          this.activeView[index] = 'pedidos';
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  groupByOC(): void {
    const grouped: { [key: string]: IOrderRecord[] } = {};

    // Filter only delivered records
    const filteredRecords = this.allRecords.filter(item => item.status === 'ENTREGUE');

    filteredRecords.forEach(item => {
      if (!grouped[item.numero_oc]) {
        grouped[item.numero_oc] = [];
      }
      grouped[item.numero_oc].push(item);
    });

    this.groupedRecords = Object.keys(grouped).map(oc => ({
      numero_oc: oc,
      pedidos: grouped[oc],
      valor_total: this.fullPrice(grouped[oc])
    }));
  }

  setActiveView(event: Event, index: number, view: string): void {
    event.stopPropagation();
    this.activeView[index] = view;
    this.expandedIndex = index;
  }

  fullPrice(items: IOrderRecord[]): number {
    return items.reduce((total, item) => {
      return total + Number(item.valor_total);
    }, 0);
  }

  unitPrice(valorTotal: string, quantidade: string) {
    return (Number(valorTotal) / Number(quantidade)).toFixed(2);
  }

  pluralize(quantidade: string, unidade: string) {
    if (Number(quantidade) === 1) {
      return unidade;
    }
    return unidade + 's';
  }

  toggleExpand(index: number): void {
    if (this.expandedIndex === index) {
      this.expandedIndex = -1;
    } else {
      this.expandedIndex = index;
    }
  }

  filter() {
    let filteredRecords = this.allRecords.filter(item => item.status === 'ENTREGUE');

    if (this.centro_custo) {
      const inputValue = this.centro_custo.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.centro_custo && data.centro_custo.toLowerCase().includes(inputValue)
      );
    }

    if (this.ordem_compra) {
      const inputValue = this.ordem_compra.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.numero_oc && data.numero_oc.toLowerCase().includes(inputValue)
      );
    }

    if (this.fornecedor) {
      const inputValue = this.fornecedor.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.nome_fornecedor && data.nome_fornecedor.toLowerCase().includes(inputValue)
      );
    }

    if (this.valor) {
      const inputValue = parseFloat(this.valor);
      if (!isNaN(inputValue)) {
        const lowerBound = inputValue * 0.83;  // 20% less
        const upperBound = inputValue * 1.25;  // 20% more

        // Group records by OC first to compare the total value
        const ocGroups: { [key: string]: IOrderRecord[] } = {};
        filteredRecords.forEach(item => {
          if (!ocGroups[item.numero_oc]) {
            ocGroups[item.numero_oc] = [];
          }
          ocGroups[item.numero_oc].push(item);
        });

        // Filter OCs where the total value is within the range
        const filteredOcs = Object.keys(ocGroups).filter(oc => {
          const totalValue = this.fullPrice(ocGroups[oc]);
          return totalValue >= lowerBound && totalValue <= upperBound;
        });

        // Get all records from the filtered OCs
        filteredRecords = filteredRecords.filter(item =>
          filteredOcs.includes(item.numero_oc)
        );
      }
    }

    this.updateGroupedRecords(filteredRecords);
  }

  updateGroupedRecords(records: IOrderRecord[]) {
    const grouped: { [key: string]: IOrderRecord[] } = {};

    records.forEach(item => {
      if (!grouped[item.numero_oc]) {
        grouped[item.numero_oc] = [];
      }
      grouped[item.numero_oc].push(item);
    });

    this.groupedRecords = Object.keys(grouped).map(oc => ({
      numero_oc: oc,
      pedidos: grouped[oc],
      valor_total: this.fullPrice(grouped[oc])
    }));
  }

  searchCentroCusto() {
    this.filter();
  }

  searchOrdemCompra() {
    this.filter();
  }

  searchFornecedor() {
    this.filter();
  }

  searchValor() {
    this.filter();
  }
}

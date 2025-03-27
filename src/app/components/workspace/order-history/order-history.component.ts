import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { RequestService } from '../../../core/services/request.service';

import { IGroupedRequest, IOrderRecord } from '../../../core/interfaces/order-response.interface';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent implements OnInit {

  ocName: string = '';
  valorName: string = '';
  fornecedorName: string = '';
  centroCustoName: string = '';

  expandedIndex: number = -1;
  groupedRecords: IGroupedRequest[] = [];
  allRecords: IOrderRecord[] = [];
  activeView: { [key: number]: string } = {};


  private _titleService = inject(TitleService);
  private _requestService = inject(RequestService);


  ngOnInit() {
    this.find();
    this._titleService.setTitle('Histórico de Pedidos');
  }

  find() {
    this._requestService.find().subscribe({
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

    const filteredRecords = this.allRecords.filter(item =>
      ['ENTREGUE'].includes(item.status)
    );

    filteredRecords.forEach(item => {
      if (!grouped[item.numero_oc]) {
        grouped[item.numero_oc] = [];
      }
      grouped[item.numero_oc].push(item);
    });

    this.groupedRecords = Object.keys(grouped).map(oc => ({
      numero_oc: oc,
      items: grouped[oc],
      total: this.fullPrice(grouped[oc])
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

  filters() {
    let filteredRecords = [...this.allRecords];

    if (this.ocName) {
      const inputValue = this.ocName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.numero_oc && data.numero_oc.toLowerCase().includes(inputValue)
      )
    }

    if (this.valorName) {
      const inputValue = this.valorName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.valor_total && data.valor_total.toLowerCase().includes(inputValue)
      )
    }

    if (this.fornecedorName) {
      const inputValue = this.fornecedorName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.nome_fornecedor && data.nome_fornecedor.toLowerCase().includes(inputValue)
      )
    }

    if (this.centroCustoName) {
      const inputValue = this.centroCustoName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.centro_custo && data.centro_custo.toLowerCase().includes(inputValue)
      )
    }

    this.allRecords = filteredRecords
  }

  searchOc() {
    this.filters();
  }

  searchValor() {
    this.filters();
  }

  searchFornecedor() {
    this.filters();
  }

  searchCentroCusto() {
    this.filters();
  }
}

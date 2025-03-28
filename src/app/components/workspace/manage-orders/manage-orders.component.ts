import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { OrderService } from '../../../core/services/order.service';
import { TitleService } from '../../../core/services/title.service';
import { IOrderRecord } from '../../../core/interfaces/order-response.interface';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, ReactiveFormsModule, MatProgressSpinnerModule],
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.scss',
})
export class ManageOrdersComponent implements OnInit {
  // Campos do filtro
  valor: string = '';
  fornecedor: string = '';
  centro_custo: string = '';
  ordem_compra: string = '';

  index: number = -1;
  loading: boolean = false;
  orderForms: { [key: string]: FormGroup } = {};
  activeSection: { [key: number]: string } = {};
  orderList: { [key: string]: IOrderRecord[] } = {};
  allRecords: IOrderRecord[] = []; // Added to store all records for filtering

  private readonly _orderService = inject(OrderService);
  private _titleService = inject(TitleService);

  ngOnInit() {
    this.getOrder();
    this._titleService.setTitle('Gerenciar Pedidos');
  }

  getOrder() {
    this._orderService.find().subscribe({
      next: (data) => {
        this.allRecords = data.order; // Store all records
        this.orderList = {};
        this.applyFilters(); // Apply initial filters
      },
      error: (error) => console.log(error)
    });
  }

  applyFilters() {
    let filteredRecords = [...this.allRecords];

    // First filter by status (keep only non-delivered records)
    filteredRecords = filteredRecords.filter(item =>
      ['NÃO ENTREGUE', 'PARCIALMENTE ENTREGUE'].includes(item.status)
    );

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
        const lowerBound = inputValue * 0.8;  // 20% less
        const upperBound = inputValue * 1.2;  // 20% more

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
          const totalValue = this.valorDaCompra(ocGroups[oc]);
          return totalValue >= lowerBound && totalValue <= upperBound;
        });

        // Get all records from the filtered OCs
        filteredRecords = filteredRecords.filter(item =>
          filteredOcs.includes(item.numero_oc)
        );
      }
    }

    // Update orderList with filtered records
    this.orderList = {};
    this.orderForms = {};

    filteredRecords.forEach(order => {
      const oc = order.numero_oc;

      if (!this.orderList[oc]) {
        this.orderList[oc] = [];
        this.orderForms[oc] = new FormGroup({
          date: new FormControl('')
        });
      }

      this.orderList[oc].push(order);
      this.orderForms[oc].addControl(
        order.idprd,
        new FormControl('')
      );
    });
  }

  updateOrder(numero_oc: string) {
    this.loading = true;
    const formData = this.orderForms[numero_oc].value;
    const dataEntrega = formData.date;

    this.orderList[numero_oc].forEach(order => {
      const quantidade = formData[order.idprd] || order.quantidade;

      const request = {
        numero_oc: numero_oc,
        idprd: order.idprd,
        quantidade: quantidade,
        data_entrega: dataEntrega,
        status: '',
      };

      this._orderService.managerOrder(request).subscribe({
        next: () => {
          console.log(`Item ${order.idprd} atualizado`);
          this.loading = false;
        },
        error: (error) => console.error(`Erro no item ${order.idprd}`, error)
      });
    });

    setTimeout(() => this.getOrder(), 1000);
  }

  getOrderCount(): number {
    return Object.keys(this.orderList).length;
  }

  expandScreen(index: number) {
    if (this.index === index) {
      this.index = -1;
    } else {
      this.index = index;
      this.activeSection[index] = 'orders';
    }
  }

  openSection(e: Event, index: number, section: string) {
    e.stopPropagation();
    this.activeSection[index] = section;
    this.index = index;
  }

  valorDaCompra(items: IOrderRecord[]): number {
    return items.reduce((total, item) => {
      return total + Number(item.valor_total);
    }, 0);
  }

  filter() {
    this.applyFilters();
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

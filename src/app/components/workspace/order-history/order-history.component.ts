import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { OrderService } from '../../../core/services/order.service';
import { ICommonData } from '../../../core/interfaces/order-response.interface';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent implements OnInit {
  private _titleService = inject(TitleService);
  private readonly _orderService = inject(OrderService);

  // Dados
  record: any[] = [];
  recordOC: Record<string, ICommonData> = {};
  deliveredOrders: Record<string, ICommonData> = {};
  filteredDeliveredOrders: Record<string, ICommonData> = {};

  // Controle de UI
  activeSection: Record<string, string> = {};
  expandedIndex: number | null = null;

  // Filtros
  centro_custo: string = '';
  ordem_compra: string = '';
  fornecedor: string = '';
  valor: string = '';

  ngOnInit() {
    this.find();
    this._titleService.setTitle('Histórico de Pedidos');
  }

  find() {
    this._orderService.findAll().subscribe({
      next: (data) => {
        this.record = data.order;
        this.processOrders();
      },
      error: (error) => {
        console.error('Erro ao buscar pedidos:', error);
      }
    });
  }

  processOrders() {
    // Agrupa os pedidos por numero_oc
    this.recordOC = this.record.reduce((acc: Record<string, ICommonData>, item: any) => {
      if (!acc[item.numero_oc]) {
        acc[item.numero_oc] = {
          data_criacao_oc: item.data_criacao_oc,
          numero_oc: item.numero_oc,
          fornecedor: item.fornecedor,
          previsao_entrega: item.previsao_entrega,
          centro_custo: item.centro_custo,
          usuario_criacao: item.usuario_criacao,
          data_entrega: item.data_entrega,
          nota_fiscal: item.nota_fiscal,
          registrado: item.registrado,
          order: []
        };
      }
      acc[item.numero_oc].order.push({
        idprd: item.idprd,
        data_criacao_oc: item.data_criacao_oc,
        material: item.material,
        quantidade: item.quantidade,
        unidade: item.unidade,
        valor_unitario: item.valor_unitario,
        valor_total: item.valor_total,
        status: item.status || 'PENDENTE',
        data_entrega: item.data_entrega,
        nota_fiscal: item.nota_fiscal,
        registrado: item.registrado,
        quantidade_entregue: item.quantidade_entregue,
      });
      return acc;
    }, {});

    this.filterDeliveredOrders();
  }

  filterDeliveredOrders() {
    // Filtra apenas ordens onde todos os itens têm status 'ENTREGUE'
    this.deliveredOrders = Object.fromEntries(
      Object.entries(this.recordOC).filter(([_, oc]) =>
        oc.order.every(item => item.status === 'ENTREGUE')
      )
    );
    this.applyFilters();
  }

  applyFilters() {
    this.filteredDeliveredOrders = Object.fromEntries(
      Object.entries(this.deliveredOrders).filter(([_, oc]) => {
        const matchesCentroCusto = !this.centro_custo || oc.centro_custo.toLowerCase().includes(this.centro_custo.toLowerCase());
        const matchesOrdemCompra = !this.ordem_compra || oc.numero_oc.toString().includes(this.ordem_compra);
        const matchesFornecedor = !this.fornecedor || oc.fornecedor.toLowerCase().includes(this.fornecedor.toLowerCase());
        const matchesValor = !this.valor || this.calculateTotalValue(oc.order).toString().includes(this.valor);
        return matchesCentroCusto && matchesOrdemCompra && matchesFornecedor && matchesValor;
      })
    );
  }

  // Métodos de busca para os filtros
  searchCentroCusto() { this.applyFilters(); }
  searchOrdemCompra() { this.applyFilters(); }
  searchFornecedor() { this.applyFilters(); }
  searchValor() { this.applyFilters(); }

  // Calcula o valor total da ordem
  calculateTotalValue(order: any[]): number {
    return order.reduce((sum, item) => sum + parseFloat(item.valor_total || 0), 0);
  }

  // Pluraliza a unidade
  pluralize(quantity: string, unit: string): string {
    return Number(quantity) === 1 ? unit : `${unit}s`;
  }

  // Calcula o valor unitário
  unitPrice(total: string | number, quantity: string | number): string {
    const totalNum = parseFloat(total as string);
    const qtyNum = parseFloat(quantity as string);
    return isNaN(totalNum) || isNaN(qtyNum) || qtyNum === 0 ? '0.00' : (totalNum / qtyNum).toFixed(2);
  }

  // Verifica se filteredDeliveredOrders está vazio
  isFilteredDeliveredOrdersEmpty(): boolean {
    return Object.keys(this.filteredDeliveredOrders).length === 0;
  }

  // Alterna a seção ativa
  toggleSection(event: Event, ocNumber: string, section: string) {
    event.stopPropagation();
    if (this.activeSection[ocNumber] === section) {
      this.activeSection[ocNumber] = '';
    } else {
      this.activeSection[ocNumber] = section;
    }
  }

  // Expande/contrai o card
  toggleExpand(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}

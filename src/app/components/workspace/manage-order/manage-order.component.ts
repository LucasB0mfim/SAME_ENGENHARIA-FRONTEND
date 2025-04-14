import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { OrderService } from '../../../core/services/order.service';
import { TitleService } from '../../../core/services/title.service';

import { ICommonData } from '../../../core/interfaces/order-response.interface';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ReactiveFormsModule, MatProgressSpinnerModule],
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.scss',
})
export class ManageOrderComponent implements OnInit {
  private _titleService = inject(TitleService);
  private readonly _orderService = inject(OrderService);

  // Modelos de dados
  item: any[] = [];
  filter: any[] = [];
  purchaseOrder: Record<string, ICommonData> = {};

  // Indice para gerenciar abertura do card
  index: number | null = null;

  // Animação para carregar a lista
  isLoading: boolean = true;

  // Card para quando não houver cards
  isVoid: boolean = false;

  // Gerenciar o estado do select
  centroCustoArrow: boolean = false;
  fornecedorArrow: boolean = false;

  // Variável para recusar mais de um centro de custo com o mesmo nome;
  singleCentroCusto: string[] = [];

  // Variável para recusar mais de um centro de custo com o mesmo nome;
  singleFornecedor: string[] = [];

  // Variáveis do filtro
  centroCustoField: string = '';
  fornecedorField: string = '';
  materialField: string = '';
  ocField: string = '';

  ngOnInit() {
    this.getOrder();
    this._titleService.setTitle('Gerenciar Pedido');
  }

  // MÉTODO PARA PEGAR OS ITENS

  getOrder() {
    this._orderService.findAll().subscribe({
      next: (data) => {
        this.item = data.order;
        this.filter = [...this.item];

        this.removeDuplicate();
        this.groupByOC();
        this.isLoading = false;
        if (this.item.length === 0) this.isVoid = true;
      },
      error: (error) => {
        console.error('Não foi possível carregar os pedidos: ', error);
        this.isLoading = false;
        this.isVoid = true;
      }
    })
  }

  // MÉTODO PARA AGRUPAR OS ITENS POR ORDEM DE COMPRA

  groupByOC() {
    this.purchaseOrder = this.filter.reduce((acc: any, item: any) => {
      if (!acc[item.numero_oc]) {
        acc[item.numero_oc] = {
          data_criacao_oc: item.data_criacao_oc,
          numero_oc: item.numero_oc,
          fornecedor: item.fornecedor,
          previsao_entrega: item.previsao_entrega,
          centro_custo: item.centro_custo,
          usuario_criacao: item.usuario_criacao,
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
    }, {})
  }

  // MÉTODO PARA ABRIR CARD //

  openCard(cardIndex: number, event?: Event) {
    if (event) event.stopPropagation();

    if (this.index === cardIndex) {
      this.index = null;
    } else {
      this.index = cardIndex;
    }
  }

  // MÉTODO PARA UTILIZAR FILTROS DE BUSCA //

  applyFilters() {
    let filteredOC = [...this.item];

    if (this.centroCustoField && this.centroCustoField.trim() !== '') {
      filteredOC = filteredOC.filter(item =>
        item.centro_custo === this.centroCustoField
      );
    }

    if (this.fornecedorField && this.fornecedorField.trim() !== '') {
      filteredOC = filteredOC.filter(item =>
        item.fornecedor === this.fornecedorField
      );
    }

    if (this.materialField && this.materialField.trim() !== '') {
      const materialFilter = this.materialField.toLowerCase();
      filteredOC = filteredOC.filter(item =>
        String(item.material).toLowerCase().includes(materialFilter)
      );
    }

    if (this.ocField && this.ocField.trim() !== '') {
      filteredOC = filteredOC.filter(item =>
        String(item.numero_oc).includes(this.ocField)
      );
    }

    this.filter = filteredOC;
    this.groupByOC();

    this.isVoid = this.filter.length === 0;
    this.index = null;
  }

  // MÉTODOS PARA USAR O SELECT //

  toggleSelect(selectType: 'centroCusto' | 'fornecedor') {
    setTimeout(() => {
      if (selectType === 'centroCusto') {
        this.centroCustoArrow = !this.centroCustoArrow;
      } else if (selectType === 'fornecedor') {
        this.fornecedorArrow = !this.fornecedorArrow;
      }
    }, 0);
  }

  resetSelectIcon(selectType: 'centroCusto' | 'fornecedor') {
    if (selectType === 'centroCusto') {
      this.centroCustoArrow = false;
    } else if (selectType === 'fornecedor') {
      this.fornecedorArrow = false;
    }
  }

  // MÉTODO PARA REMOVER 'CENTRO DE CUSTO' E 'FORNECEDOR' COM MESMO NOME //

  removeDuplicate() {
    const centroCustoList = new Set<string>();
    const fornecedorList = new Set<string>();

    this.item.forEach(item => {
      if (item.centro_custo && item.centro_custo.trim() !== '') {
        centroCustoList.add(item.centro_custo);
      }
    });

    this.item.forEach(item => {
      if (item.fornecedor && item.fornecedor.trim() !== '') {
        fornecedorList.add(item.fornecedor);
      }
    });

    this.singleCentroCusto = Array.from(centroCustoList).sort();
    this.singleFornecedor = Array.from(fornecedorList).sort();
  }
}

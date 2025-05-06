import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { OrderService } from '../../../core/services/order.service';
import { TitleService } from '../../../core/services/title.service';

import { ICommonData } from '../../../core/interfaces/order-response.interface';

@Component({
  selector: 'app-order-delivered',
  imports: [CommonModule, FormsModule, MatIconModule, ReactiveFormsModule, MatProgressSpinnerModule, MatProgressBarModule],
  templateUrl: './order-delivered.component.html',
  styleUrl: './order-delivered.component.scss'
})
export class OrderDeliveredComponent implements OnInit {

  // INJEÇÃO DE DEPENDÊNCIAS
  private readonly _orderService = inject(OrderService);
  private readonly _titleService = inject(TitleService);

  // VARIÁVEIS DE ESTADO
  isVoid: boolean = false;
  isLoading: boolean = true;
  isSelectOpen: boolean = false;

  // MODELOS DE DADOS
  order: any[] = [];
  originalOrder: any[] = [];
  purchaseOrder: Record<string, ICommonData> = {};
  activeSection: Record<string, string> = {};

  // VARIÁVEIS DO FILTRO
  ocField: string = '';
  fornecedorField: string = '';
  centroCustoField: string = '';
  materialField: string = '';
  centrosCustoUnicos: string[] = [];

  // HOOK DE CICLO
  ngOnInit(): void {
    this.getOrder();
    this._titleService.setTitle('Pedidos Entregues');
  }

  // MÉTODO PARA CAPTURAR OS ITENS
  getOrder(): void {
    this._orderService.findAll().subscribe({
      next: (data) => {
        // Salvar os dados originais para filtragem posterior
        this.originalOrder = data.order.filter((item: { status: string }) => item.status === 'ENTREGUE');

        // Inicializar order com os dados originais
        this.order = [...this.originalOrder];

        this.removeDuplicate();
        this.groupByOC();

        this.isLoading = false;
        if (this.originalOrder.length === 0) this.isVoid = true;
      },
      error: (error) => {
        console.error('Não foi possível carregar os pedidos:', error);
        this.isLoading = false;
        this.isVoid = true;
      }
    });
  }

  // MÉTODO PARA AGRUPAR OS ITENS POR ORDEM DE COMPRA
  groupByOC(): void {
    this.purchaseOrder = this.order.reduce((acc: any, item: any) => {
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
        previsao_entrega: item.previsao_entrega,
        nota_fiscal: item.nota_fiscal,
        registrado: item.registrado,
        quantidade_entregue: item.quantidade_entregue,
      });

      return acc;
    }, {});
  }

  // MÉTODO PARA CALCULAR O VALOR TOTAL DO PEDIDO
  calculateOrderTotal(orderData: ICommonData): number {
    const total = orderData.order.reduce((acc, item) => {
      const itemTotal = item.valor_total ? parseFloat(item.valor_total) : 0;
      return acc + itemTotal;
    }, 0);

    return Number(total.toFixed(2));
  }

  // MÉTODO PARA FORMATAR O VALOR TOTAL
  formateValue(valorTotal: string) {
    return 'R$ ' + Number(valorTotal).toFixed(2);
  }

  // MÉTODO PARA REDIRECIONAR O USUÁRIO PARA A NOTA FISCAL
  goToNotaFiscal(nf: string) {
    window.open(`http://192.168.10.17:3000/same-engenharia/api/notas_fiscais/${nf}`, '_blank');
  }

  // MÉTODO PARA FORMATAR A DATA DE ENTREGA
  formateDate(date: string) {
    const year = date.split('-')[0];
    const month = date.split('-')[1];
    const day = date.split('-')[2];

    return `${day}/${month}/${year}`
  }

  // MÉTODO PARA RETORNAR APENAS UMA ÚNICA VEZ CADA CENTRO DE CUSTO
  removeDuplicate(): void {
    const centrosCustoSet = new Set<string>();

    this.originalOrder.forEach(item => {
      if (item.centro_custo && item.centro_custo.trim() !== '') {
        centrosCustoSet.add(item.centro_custo);
      }
    });

    this.centrosCustoUnicos = Array.from(centrosCustoSet).sort();
  }

  // MÉTODO PARA FILTRAR
  applyFilters(): void {
    // Aplicar filtros aos dados originais
    let filteredData = [...this.originalOrder];

    // Filtro por número OC
    if (this.ocField && this.ocField.trim() !== '') {
      filteredData = filteredData.filter(item =>
        String(item.numero_oc).includes(this.ocField)
      );
    }

    // Filtro por centro de custo
    if (this.centroCustoField && this.centroCustoField.trim() !== '') {
      filteredData = filteredData.filter(item =>
        item.centro_custo === this.centroCustoField
      );
    }

    // Filtro por material
    if (this.materialField && this.materialField.trim() !== '') {
      const materialFilter = this.materialField.toLowerCase();
      filteredData = filteredData.filter(item =>
        String(item.material).toLowerCase().includes(materialFilter)
      );
    }

    // Filtro por fornecedor
    if (this.fornecedorField && this.fornecedorField.trim() !== '') {
      filteredData = filteredData.filter(item =>
        item.fornecedor?.toLowerCase().includes(this.fornecedorField.toLowerCase())
      );
    }

    // Atualizar os dados filtrados
    this.order = filteredData;

    // Reagrupar os dados filtrados por OC
    this.groupByOC();

    // Resetar o estado de expansão e seções ativas
    this.isVoid = this.order.length === 0;
  }

  // MÉTODO PARA MUDAR A POSIÇÃO DO SELECT
  toggleSelect(): void {
    setTimeout(() => {
      this.isSelectOpen = !this.isSelectOpen;
    }, 0);
  }

  // MÉTODO PARA REINICIAR A POSIÇÃO DO SELECT
  resetSelectIcon(): void {
    this.isSelectOpen = false;
  }
}

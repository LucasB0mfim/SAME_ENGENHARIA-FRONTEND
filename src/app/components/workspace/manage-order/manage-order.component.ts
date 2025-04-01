import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../core/services/title.service';
import { OrderService } from '../../../core/services/order.service';
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
  private _orderService = inject(OrderService);
  private _fb = inject(FormBuilder);

  // Dados
  record: any[] = [];
  recordOC: Record<string, ICommonData> = {};
  partialOrNotDeliveredOrders: Record<string, ICommonData> = {};
  filteredOrders: Record<string, ICommonData> = {};

  // Controle de UI
  activeSection: Record<number, string> = {};
  expandedIndex: number | null = null;
  orderForms: Record<string, FormGroup> = {};
  loading: boolean = false;

  // Filtros
  centro_custo: string = '';
  ordem_compra: string = '';
  fornecedor: string = '';
  valor: string = '';

  ngOnInit() {
    this.getOrders();
    this._titleService.setTitle('Gerenciar Pedidos');
  }

  getOrders() {
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

    this.filterPartialOrNotDeliveredOrders();
  }

  filterPartialOrNotDeliveredOrders() {
    // Filtra ordens com pelo menos um item 'PARCIALMENTE ENTREGUE' ou 'NÃO ENTREGUE'
    this.partialOrNotDeliveredOrders = Object.fromEntries(
      Object.entries(this.recordOC).filter(([_, oc]) =>
        oc.order.some(item => item.status === 'PARCIALMENTE ENTREGUE' || item.status === 'NÃO ENTREGUE')
      )
    );
    this.createForms();
    this.applyFilters();
  }

  createForms() {
    // Cria um FormGroup para cada numero_oc
    Object.keys(this.partialOrNotDeliveredOrders).forEach(numero_oc => {
      const orders = this.partialOrNotDeliveredOrders[numero_oc].order;
      const group: any = {};
      orders.forEach(order => {
        group[order.idprd] = this._fb.control(order.quantidade_entregue || '');
      });
      group['date'] = this._fb.control(this.partialOrNotDeliveredOrders[numero_oc].data_entrega || '');
      this.orderForms[numero_oc] = this._fb.group(group);
    });
  }

  applyFilters() {
    this.filteredOrders = Object.fromEntries(
      Object.entries(this.partialOrNotDeliveredOrders).filter(([_, oc]) => {
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

  // Verifica se filteredOrders está vazio
  getOrderCount(): number {
    return Object.keys(this.filteredOrders).length;
  }

  // Alterna a seção ativa
  openSection(event: Event, index: number, section: string) {
    event.stopPropagation();
    if (this.activeSection[index] === section) {
      this.activeSection[index] = '';
    } else {
      this.activeSection[index] = section;
    }
  }

  // Expande/contrai o card
  expandScreen(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  // Atualiza os pedidos no backend
  updateOrder(numero_oc: string) {
    const form = this.orderForms[numero_oc];
    if (!form.valid) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    this.loading = true;
    const orders = this.partialOrNotDeliveredOrders[numero_oc].order;

    orders.forEach((item: any) => {
      const quantidade_entregue = form.get(item.idprd)?.value;
      const data_entrega = form.get('date')?.value;

      const payload = {
        idprd: item.idprd,
        status: 'PENDENTE',
        previsao_entrega: data_entrega,
        registrado: item.registrado || 'TESTE',
        quantidade: quantidade_entregue.toString()
      };

      this._orderService.updateStatus(payload).subscribe({
        next: () => {
          this.loading = false;
          this.getOrders();
        },
        error: (error) => {
          this.loading = false;
          console.error(`Erro ao atualizar o item ${item.idprd}:`, error);
          alert('Erro ao atualizar o pedido. Veja o console para mais detalhes.');
        }
      });
    });
  }
}

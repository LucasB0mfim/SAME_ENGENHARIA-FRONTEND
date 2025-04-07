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
  purchaseOrder: Record<string, ICommonData> = {};

  ngOnInit() {
    this.getOrder();
    this._titleService.setTitle('Gerenciar Pedido');
  }

  getOrder() {
    this._orderService.findAll().subscribe({
      next: (data) => {
        this.item = data.order;
        this.groupByOC();
      },
      error: (error) => {
        console.error('Não foi possível carregar os pedidos: ', error);
      }
    })
  }

  groupByOC() {
    this.purchaseOrder = this.item.reduce((acc: any, item: any) => {
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
        }
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


}

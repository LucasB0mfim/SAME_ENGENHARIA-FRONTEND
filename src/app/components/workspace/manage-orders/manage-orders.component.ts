import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

import { OrderService } from '../../../core/services/order.service';
import { TitleService } from '../../../core/services/title.service';
import { IOrderRecord } from '../../../core/interfaces/order-response.interface';

@Component({
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule],
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.scss',
})
export class ManageOrdersComponent implements OnInit {
  orderList: { [key: string]: IOrderRecord[] } = {};
  orderForms: { [key: string]: FormGroup } = {};

  private readonly _orderService = inject(OrderService);
  private _titleService = inject(TitleService);

  ngOnInit() {
    this.getOrder();
    this._titleService.setTitle('Gerenciar Pedidos');
  }

  getOrder() {
    this._orderService.find().subscribe({
      next: (data) => {
        this.orderList = {};
        for (const order of data.order) {
          if (order.status === 'NÃO ENTREGUE' || order.status === 'PARCIALMENTE ENTREGUE') {
            const oc = order.numero_oc;

            if (!this.orderList[oc]) {
              this.orderList[oc] = [];
              this.orderForms[oc] = new FormGroup({
                date: new FormControl('')
                // Removemos o FormGroup 'quantities' aqui
              });
            }

            this.orderList[oc].push(order);

            // Adiciona o controle diretamente no FormGroup principal
            this.orderForms[oc].addControl(
              order.idprd,
              new FormControl('')
            );
          }
        }
      },
      error: (error) => console.log(error)
    });
  }

  updateOrder(numero_oc: string) {
    const formData = this.orderForms[numero_oc].value;
    const dataEntrega = formData.date;

    // Para cada item da OC
    this.orderList[numero_oc].forEach(order => {
      // Acessa diretamente o valor do controle pelo idprd
      const quantidade = formData[order.idprd] || order.quantidade;

      const request = {
        numero_oc: numero_oc,
        idprd: order.idprd,
        quantidade: quantidade,
        data_entrega: dataEntrega,
        status: '',
      };

      this._orderService.managerOrder(request).subscribe({
        next: () => console.log(`Item ${order.idprd} atualizado`),
        error: (error) => console.error(`Erro no item ${order.idprd}`, error)
      });
    });

    setTimeout(() => this.getOrder(), 1000);
  }

  getOrderCount(): number {
    return Object.keys(this.orderList).length;
  }
}

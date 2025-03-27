import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { RequestService } from '../../../core/services/request.service';

import { IOrderRecord } from '../../../core/interfaces/order-response.interface';

@Component({
  selector: 'app-manage-orders',
  imports: [CommonModule, FormsModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.scss'
})
export class ManageOrdersComponent implements OnInit {
  expandedIndex: number = -1;
  records: IOrderRecord[] = [];
  allRecords: IOrderRecord[] = [];

  ocName: string = '';
  valorName: string = '';
  fornecedorName: string = '';
  centroCustoName: string = '';

  private _titleService = inject(TitleService);
  private _requestService = inject(RequestService);

  newDateForm: FormGroup = new FormGroup({
    newDate: new FormControl('')
  });

  detailsForm: FormGroup = new FormGroup({
    details: new FormControl('')
  });

  ngOnInit() {
    this.find();
    this._titleService.setTitle('Gerenciar Pedidos')
  }

  find() {
    this._requestService.find().subscribe({
      next: (data) => {
        this.records = data.order.filter(data => data.status === 'PARCIALMENTE ENTREGUE' || data.status === 'NÃO ENTREGUE');
        this.allRecords = [...data.order]
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  toggleExpand(index: number): void {
    if (this.expandedIndex === index) {
      this.expandedIndex = -1; // Fecha o item
    } else {
      this.expandedIndex = index; // Abre o item clicado
    }
  }

  updateTime(index: number) {
    const currentRecord = this.records[index];
    const formData = new FormData();

    formData.append('data_entrega', this.newDateForm.value.newDate);
    formData.append('status', '');
    formData.append('quantidade_entregue', '');
    formData.append('oc', currentRecord.numero_oc.toString());

    this.submitUpdate(formData);
  }

  updateDetails(index: number) {
    const currentRecord = this.records[index];
    const formData = new FormData();

    formData.append('data_entrega', this.detailsForm.value.details);
    formData.append('oc', currentRecord.numero_oc.toString());

    this.submitUpdate(formData);
  }

  submitUpdate(formData: FormData) {
    this._requestService.update(formData).subscribe({
      next: () => {
        this.find();
        this.expandedIndex = -1;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  calculateRemaining(quantidade: string, quantidade_entregue: string) {
    return Number(quantidade) - Number(quantidade_entregue);
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

    this.records = filteredRecords
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

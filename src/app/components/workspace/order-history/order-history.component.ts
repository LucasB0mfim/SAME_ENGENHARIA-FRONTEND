import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { RequestService } from '../../../core/services/request.service';

import { IRequestRecord } from '../../../core/interfaces/request-response.interface';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent implements OnInit {

  photo: File | null = null;
  expandedIndex: number = -1;
  records: IRequestRecord[] = [];
  allRecords: IRequestRecord[] = [];

  ocName: string = '';
  valorName: string = '';
  fornecedorName: string = '';
  centroCustoName: string = '';

  private _titleService = inject(TitleService);
  private _requestService = inject(RequestService);

  private resetForms() {
    this.deliveredForm.reset({ image: '' });
    this.partiallyDeliveredForm.reset({ amount: '' });
    this.urgencyForm.reset({ urgency: 'low' });
  }

  deliveredForm: FormGroup = new FormGroup({
    image: new FormControl('')
  });

  partiallyDeliveredForm: FormGroup = new FormGroup({
    amount: new FormControl('')
  });

  urgencyForm: FormGroup = new FormGroup({
    urgency: new FormControl('low')
  });

  ngOnInit() {
    this.find();
    this._titleService.setTitle('Histórico de Pedidos')
  }

  find() {
    this._requestService.find().subscribe({
      next: (data) => {
        this.records = data.order.filter(data => data.status === 'ENTREGUE');
        this.allRecords = [...data.order];
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

  onFile(event: any) {
    const file = event.target.files[0]
    if (file) this.photo = file;
  }

  delivered(index: number) {
    const formData = new FormData();
    const today = new Date().toISOString();
    const currentRecord = this.records[index];

    if (this.photo) {
      formData.append('nf', this.photo, this.photo.name); // Campo 'nf' para o multer
    }

    formData.append('urgency', '');
    formData.append('status', 'ENTREGUE');
    formData.append('ultima_atualizacao', today);
    formData.append('oc', currentRecord.oc.toString());
    formData.append('quantidade_entregue', currentRecord.quantidade.toString());

    this.submitUpdate(formData);
  }

  partial(index: number) {
    const today = new Date().toISOString();
    const currentRecord = this.records[index];
    const receivedAmount = Number(this.partiallyDeliveredForm.value.amount);

    const formData = new FormData();
    formData.append('urgencia', '');
    formData.append('oc', currentRecord.oc.toString());
    formData.append('status', 'PARCIALMENTE ENTREGUE');
    formData.append('ultima_atualizacao', today);
    formData.append('quantidade_entregue', receivedAmount.toString());

    this.submitUpdate(formData);
  }

  NotDelivered(index: number) {
    const formData = new FormData();
    const today = new Date().toISOString();
    const currentRecord = this.records[index];

    formData.append('status', 'NÃO ENTREGUE');
    formData.append('quantidade_entregue', '0');
    formData.append('ultima_atualizacao', today);
    formData.append('oc', currentRecord.oc.toString());
    formData.append('urgencia', this.urgencyForm.value.urgency);

    this.submitUpdate(formData);
  }

  submitUpdate(formData: FormData) {
    this._requestService.update(formData).subscribe({
      next: () => {
        this.find();
        this.resetForms();
        this.expandedIndex = -1;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  filters() {
    let filteredRecords = [...this.allRecords];

    if (this.ocName) {
      const inputValue = this.ocName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.oc && data.oc.toLowerCase().includes(inputValue)
      )
    }

    if (this.valorName) {
      const inputValue = this.valorName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.valor && data.valor.toLowerCase().includes(inputValue)
      )
    }

    if (this.fornecedorName) {
      const inputValue = this.fornecedorName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.fornecedor && data.fornecedor.toLowerCase().includes(inputValue)
      )
    }

    if (this.centroCustoName) {
      const inputValue = this.centroCustoName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.centro_de_custo && data.centro_de_custo.toLowerCase().includes(inputValue)
      )
    }

    this.records = filteredRecords
  }

  searchOc() {
    console.log('ocName:', this.ocName);
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

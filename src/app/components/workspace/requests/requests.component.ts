import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { OrderService } from '../../../core/services/order.service';

import { IOrderListRequest, IOrderRecord } from '../../../core/interfaces/order-response.interface';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export class RequestsComponent implements OnInit {
  photo: File | null = null;
  expandedIndex: number = -1;
  groupedRecords: IOrderListRequest[] = [];
  allRecords: IOrderRecord[] = [];
  activeView: { [key: number]: string } = {};
  employee: string = '';

  partiallyDeliveredForm: FormGroup;

  private _titleService = inject(TitleService);
  private _orderService = inject(OrderService);
  private _employee = inject(DashboardService);

  constructor() {
    this.partiallyDeliveredForm = new FormGroup({});
  }

  ngOnInit() {
    this.find();
    this.user();
    this._titleService.setTitle('Recebimento de Material');
  }

  find() {
    this._orderService.find().subscribe({
      next: (data) => {
        this.allRecords = data.order;
        this.groupByOC();
        this.initPartialDeliveryForm();

        // Initialize activeView
        this.groupedRecords.forEach((group, index) => {
          this.activeView[index] = 'pedidos';
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  // Initialize dynamic form for partial delivery
  initPartialDeliveryForm() {
    const formControls: { [key: string]: FormControl } = {};

    this.groupedRecords.forEach((group, groupIndex) => {
      group.pedidos.forEach((item, itemIndex) => {
        // Create a unique control name for each item
        const controlName = `amount${groupIndex}_${itemIndex}`;
        formControls[controlName] = new FormControl('', [
          Validators.min(0),
          Validators.max(Number(item.quantidade))
        ]);
      });
    });

    this.partiallyDeliveredForm = new FormGroup(formControls);
  }

  user() {
    this._employee.findAll().subscribe({
      next: (data) => {
        this.employee = data.employee.email
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  groupByOC(): void {
    const grouped: { [key: string]: IOrderRecord[] } = {};

    // Filtrar apenas registros com status específicos para mostrar
    const filteredRecords = this.allRecords.filter(item =>
      !['ENTREGUE', 'NÃO ENTREGUE', 'PARCIALMENTE ENTREGUE'].includes(item.status)
    );

    filteredRecords.forEach(item => {
      if (!grouped[item.numero_oc]) {
        grouped[item.numero_oc] = [];
      }
      grouped[item.numero_oc].push(item);
    });

    this.groupedRecords = Object.keys(grouped).map(oc => ({
      numero_oc: oc,
      pedidos: grouped[oc],
      valor_total: this.ValorDaCompra(grouped[oc])
    }));
  }

  // Ensure event stops propagation to prevent toggling expand
  setActiveView(event: Event, index: number, view: string): void {
    event.stopPropagation();
    this.activeView[index] = view;
    this.expandedIndex = index;
  }

  ValorDaCompra(items: IOrderRecord[]): number {
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

  private resetForms() {
    this.partiallyDeliveredForm.reset();
    this.photo = null;
  }

  onFile(event: any) {
    const file = event.target.files[0];
    if (file) this.photo = file;
  }

  delivered(index: number) {
    const today = new Date().toISOString();
    const currentRecord = this.groupedRecords[index];

    if (!this.photo) {
      alert('Por favor, selecione uma nota fiscal');
      return;
    }

    currentRecord.pedidos.forEach((item) => {
      const formData = new FormData();
      // Verifica novamente se this.photo não é null antes de adicionar
      if (this.photo) {
        formData.append('nota_fiscal', this.photo, this.photo.name);
      }
      formData.append('numero_oc', currentRecord.numero_oc);
      formData.append('status', 'ENTREGUE');
      formData.append('ultima_atualizacao', today);
      formData.append('recebedor', this.employee);
      formData.append('idprd', item.idprd);
      formData.append('quantidade_entregue', item.quantidade);

      this.submitUpdate(formData);
    });
  }

  partial(index: number) {
    const today = new Date().toISOString();
    const currentRecord = this.groupedRecords[index];

    currentRecord.pedidos.forEach((item, itemIndex) => {
      // Get the received quantity for this specific item
      const controlName = `amount${index}_${itemIndex}`;
      const receivedQuantity = this.partiallyDeliveredForm.get(controlName)?.value || 0;

      if (receivedQuantity > 0) {
        const formData = new FormData();
        formData.append('numero_oc', currentRecord.numero_oc);
        formData.append('status', 'PARCIALMENTE ENTREGUE');
        formData.append('ultima_atualizacao', today);
        formData.append('recebedor', this.employee);
        formData.append('idprd', item.idprd);
        formData.append('quantidade_entregue', receivedQuantity.toString());

        this.submitUpdate(formData);
      }
    });
  }

  NotDelivered(index: number) {
    const today = new Date().toISOString();
    const currentRecord = this.groupedRecords[index];

    currentRecord.pedidos.forEach((item) => {
      const formData = new FormData();
      formData.append('numero_oc', currentRecord.numero_oc);
      formData.append('status', 'NÃO ENTREGUE');
      formData.append('ultima_atualizacao', today);
      formData.append('recebedor', this.employee);
      formData.append('idprd', item.idprd);
      formData.append('quantidade_entregue', '0');

      this.submitUpdate(formData);
    });
  }

  submitUpdate(formData: FormData) {
    this._orderService.update(formData).subscribe({
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
}

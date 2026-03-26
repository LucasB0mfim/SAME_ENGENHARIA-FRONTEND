import { finalize } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { TitleService } from '../../../../core/services/title.service';
import { InvoiceService } from '../../services/invoice.service';

import { InvoiceItem, InvoiceCountStatus, MessageType } from '../../interfaces/financial.interface';


@Component({
  selector: 'app-invoice',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit {
  private readonly _titleService = inject(TitleService);
  private readonly _invoiceService = inject(InvoiceService);

  updateForm: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    observacao: new FormControl(null, Validators.required),
  });

  items: InvoiceItem[] = [];
  filteredItems: InvoiceItem[] = [];
  currentItem: InvoiceItem = {} as InvoiceItem;
  activeEmployees: string[] = [];

  countStatus: InvoiceCountStatus = {
    pendente: 0, pago: 0, vencido: 0, cancelado: 0
  };

  employee: string = '';
  activeStatus: string = '';

  menuModalOpen: boolean = false;
  createModalOpen: boolean = false;
  updateModalOpen: boolean = false;

  isEmpty: boolean = false;
  isLoading: boolean = false;
  isSearching: boolean = false;

  message: string = '';
  showMessage: boolean = false;
  messageType: MessageType = 'success';

  ngOnInit(): void {
    this._titleService.setTitle('Notas Fiscais');
    this.findByStatus('PENDENTE');
    this.countByStatus();
  }

  findByStatus(status: string): void {
    this.items = [];
    this.isEmpty = false;
    this.isSearching = true;

    this._invoiceService.findByStatus(status)
      .pipe(finalize(() => (this.isSearching = false)))
      .subscribe({
        next: (res) => {
          this.items = res.result;
          this.filteredItems = [...this.items];
          this.isEmpty = this.items.length === 0;
          this.activeStatus = status;
        },
        error: (err) => console.error(err.error.message, err),
      });
  }

  countByStatus(): void {
    this._invoiceService.countByStatus().subscribe({
      next: (res) => {
        this.countStatus = res.result
      },
      error: (err) => console.error(err)
    });
  }

  update(): void {
    this.isLoading = true;

    const request = {
      id: this.updateForm.value.id,
      status: this.updateForm.value.status,
      observacao: this.updateForm.value.observacao,
    };

    this._invoiceService.update(request)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          this.updateModalOpen = false;
          this.findByStatus(this.activeStatus);
          this.setMessage(res.message, 'success');
        },
        error: (err) => this.setMessage(err.error.message, 'error'),
      });
  }

  delete(): void {
    this._invoiceService.delete(this.currentItem.id)
      .pipe(finalize(() => !this.isLoading))
      .subscribe({
        next: (res) => {
          this.menuModalOpen = false;
          this.findByStatus(this.activeStatus);
          this.setMessage(res.message, 'success');
        },
        error: (err) => this.setMessage(err.error.message, 'error'),
      });
  }

  applyFilters(): void {
    if (!this.employee) {
      this.items = [...this.filteredItems];
      return;
    }

    const query = this.employee
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    this.items = this.filteredItems.filter((item) => {
      if (!item.nome_completo) return false;
      const nome = item.nome_completo.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return nome.includes(query);
    });
  }

  openMenu(item: InvoiceItem): void {
    this.menuModalOpen = true;
    this.currentItem = item;
  }

  closeModals(): void {
    this.menuModalOpen = false;
    this.updateModalOpen = false;
    this.createModalOpen = false;
  }

  openUpdateModal(): void {
    this.menuModalOpen = false;
    this.updateModalOpen = true;
    this.updateForm.patchValue({
      id: this.currentItem.id,
      status: this.currentItem.status,
      observacao: this.currentItem.observacao,
    });
  }

  returnModal(): void {
    this.menuModalOpen = true;
    this.updateModalOpen = false;
  }

  formateDate(date: string | null): string {
    if (!date) return 'N/A';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  setMessage(message: string, type: MessageType = 'success'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  }

  copyContent(value: string): void {
    if (!value) return;
    navigator.clipboard.writeText(value);
    alert("Copiado!");
  }

  OpenLink(): void {
    const link = this.currentItem.arquivo_url;
    window.open(`https://sameengenharia.com.br/api/invoice/file/${link}`, '_blank', 'noopener,noreferrer');
  }
}

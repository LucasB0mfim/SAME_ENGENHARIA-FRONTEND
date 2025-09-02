import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../core/services/title.service';
import { EquipmentRentalService } from '../../../core/services/equipment-rental.service';

interface status {
  'ATIVO': number;
  'DEVOLVIDO': number
}

type statusKey = keyof status;

@Component({
  selector: 'app-test',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private _equipamentService = inject(EquipmentRentalService);

  // ========== ESTADOS ========== //
  items: any[] = [];
  filteredItems: any[] = [];
  costCenters: any = null;

  selectedStatus: statusKey = 'ATIVO';
  status: status = { 'ATIVO': 0, 'DEVOLVIDO': 0 };

  isFind: boolean = false;
  isEmpty: boolean = false;
  isLoading: boolean = false;

  idmov: string = '';
  costCenter: string = 'GERAL';

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  // ========== HOOK ========== //
  ngOnInit(): void {
    this.loadInitial();
    this._titleService.setTitle('Locação');
  }

  // ========== LOADING INICIAL OTIMIZADO ========== //
  loadInitial(): void {
    this.items = [];
    this.isEmpty = false;
    this.isLoading = true;

    const statusList: statusKey[] = ['ATIVO', 'DEVOLVIDO'];

    const requests = statusList.map(status =>
      this._equipamentService.findByStatus(status)
    );

    forkJoin(requests)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {

          statusList.forEach((status: statusKey, index: number) => {
            const data = res[index]?.result || [];
            this.status[status] = data.length;
          });

          this.items = res[0]?.result || [];
          this.filteredItems = [...this.items];
          this.costCenters = [...new Set(this.items.map((item) => item.centro_custo))];

          this.isEmpty = this.items.length === 0;
          this.applyFilters();
        },
        error: (err) => {
          this.isEmpty = true;
          console.log('Erro ao carregar dados: ', err);
          this.setMessage('Não foi possível carregar os dados!', 'error');
        }
      });
  }

  // ========== FILTRO POR STATUS ========== //
  getByStatus(status: string): void {
    const statusKey = status as statusKey;
    this.selectedStatus = statusKey;

    this.items = [];
    this.isEmpty = false;
    this.isLoading = true;

    this._equipamentService.findByStatus(status)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          const data = res.result || [];

          this.items = data;
          this.filteredItems = [...this.items];

          this.status[statusKey] = data.length;
          this.isEmpty = this.items.length === 0;
        },
        error: (err) => {
          this.isEmpty = true;
          console.error('Erro ao carregar:', err);
          this.setMessage('Erro ao carregar!', 'error');
        }
      });
  }

  // ========== FILTROS ========== //
  applyFilters() {
    let data = [...this.filteredItems];

    if (this.idmov) {
      const inputValue = this.idmov.trim();
      data = data.filter(item =>
        item.idmov && item.idmov.toString().includes(inputValue)
      );
    }

    if (this.costCenter && this.costCenter !== 'GERAL') {
      const inputValue = this.costCenter;
      data = data.filter(item =>
        item.centro_custo && item.centro_custo.includes(inputValue)
      );
    }

    this.items = data;
    this.isEmpty = this.items.length === 0;
  }

  // ========== MENSAGEM DINAMICA ========== //
  setMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  }

  // ========== AUXILIARES ========== //
  formateDate(date: string): string {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }
}


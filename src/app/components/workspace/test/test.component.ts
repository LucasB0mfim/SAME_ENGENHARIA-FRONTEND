import { finalize, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { EquipmentRentalService } from '../../../core/services/equipment-rental.service';
import { forkJoin, Observable } from 'rxjs';

interface status {
  'ATIVO': number;
  'DEVOLVIDO': number
}

type statusKey = keyof status;

@Component({
  selector: 'app-test',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {
  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private _equipamentService = inject(EquipmentRentalService);

  // ========== ESTADOS ========== //
  items: any[] = [];
  filteredItem: any[] = [];
  costCenters: any = null;

  status: status = { 'ATIVO': 0, 'DEVOLVIDO': 0 };
  selectedStatus: statusKey = 'ATIVO';

  idmov: string = '';
  costCenter: string = '';

  isFind: boolean = false;
  isEmpty: boolean = false;
  isLoading: boolean = true;

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  // ========== HOOK ========== //
  ngOnInit(): void {
    this.loadInitial();
    this._titleService.setTitle('Locação');
  }

  // ========== LOADING INICIAL ========== //
  loadInitial(): void {
    forkJoin({
      contadores: this.statusCounter(),
      inicialData: this._equipamentService.findByStatus(this.selectedStatus)
    }).pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.items = res.inicialData.result;
          this.costCenters = [...new Set(this.items.map((item) => item.centro_custo))];
        },
        error: (err) => {
          console.log('Erro ao consultar dados: ', err);
          this.setMessage('Não foi possível carregar os dados!', 'error');
        }
      })
  }

  // ========== LOADING INICIAL ========== //
  getByStatus(status: string): void {
    const statusKey = status as statusKey;
    this.selectedStatus = statusKey;

    this._equipamentService.findByStatus(status)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.items = res.result;
        },
        error: (err) => {
          console.error('Erro ao filtrar por status:', err);
          this.setMessage('Erro ao carregar dados do status selecionado!', 'error');
        }
      })
  }

  statusCounter(): Observable<any> {
    const statusList: statusKey[] = ['ATIVO', 'DEVOLVIDO'];

    const requests = statusList.map(status =>
      this._equipamentService.findByStatus(status)
    );

    return forkJoin(requests).pipe(
      tap((results: any[]) => {
        statusList.forEach((status: statusKey, index: number) => {
          this.status[status] = results[index]?.result?.length || 0;
        });
      })
    );
  }

  // ========== AUXILIARES ========== //
  formateDate(date: string): string {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
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

  applyFilters() {
    let item = [...this.filteredItem];

    if (this.idmov) {
      const inputValue = this.idmov.toString();
      item = item.filter((item) =>
        item.idmov.includes(inputValue)
      )
    }

    if (this.costCenter) {
      const inputValue = this.costCenter.toString();
      item = item.filter((item) =>
        item.centro_custo.includes(inputValue)
      )
    }

    this.items = item;
  }
}

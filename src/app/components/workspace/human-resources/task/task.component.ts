import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { TaskService } from '../../../../core/services/task.service';
import { TitleService } from '../../../../core/services/title.service';

interface status {
  'SOLICITACAO': number;
  'ANDAMENTO': number;
  'FINALIZADO': number
}

type statusKey = keyof status;

@Component({
  selector: 'app-task',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {
  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private _taskService = inject(TaskService);

  // ========== FORMULÁRIOS ========== //
  updateForm: FormGroup = new FormGroup({
    status: new FormControl('', Validators.required)
  });

  // ========== ESTADOS ========== //
  items: any[] = [];
  filteredItems: any[] = [];

  employees: any = null;

  selectedStatus: statusKey = 'SOLICITACAO';
  status: status = { 'SOLICITACAO': 0, 'ANDAMENTO': 0, 'FINALIZADO': 0 };

  isFind: boolean = false;
  isEmpty: boolean = false;
  isLoading: boolean = false;
  isProcessing: boolean = false;

  isTaskOpen: boolean = false;
  isMenuOpen: boolean = false;
  isEditOpen: boolean = false;
  isListOpen: boolean = false;

  costCenters: any = null;
  costCenter: string = 'GERAL';

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this._titleService.setTitle('Tarefas');
    this.isTaskOpen = true;
    this.loadInitial();
  };

  loadInitial(): void {
    this.items = [];
    this.isEmpty = false;
    this.isLoading = true;

    const statusList: statusKey[] = ['SOLICITACAO', 'ANDAMENTO', 'FINALIZADO'];

    const requests = statusList.map(status =>
      this._taskService.findByStatus(status)
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
  };

  getByStatus(status: string): void {
    const statusKey = status as statusKey;
    this.selectedStatus = statusKey;

    this.items = [];
    this.isEmpty = false;
    this.isLoading = true;

    this._taskService.findByStatus(status)
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
  };

  update(): void {
    this.isProcessing = true;

    const request = {
      id: this.employees.id,
      status: this.updateForm.value.status
    }

    this._taskService.update(request)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe({
        next: (res) => {
          this.loadInitial();
          this.isEditOpen = false;
          this.updateForm.reset({ status: '' });
          this.setMessage(res.message, 'success');
        },
        error: (err) => {
          this.setMessage(err.error.message, 'error');
          console.log('Não foi possível atualizar tarefa: ', err);
        }
      })
  };

  openMenu(item: any): void {
    this.employees = item;
    this.isMenuOpen = true;
  };

  openList() {
    this.isMenuOpen = false;
    this.isTaskOpen = false;
    this.isListOpen = true;
    this.calculateValueTask();
  };

  openEdit() {
    this.isMenuOpen = false;
    this.isEditOpen = true;
  };

  closeModal(): void {
    this.isMenuOpen = false;
    this.isEditOpen = false;
  };

  returnMenu(): void {
    this.isEditOpen = false;
    this.isListOpen = false;
    this.isMenuOpen = true;
  };

  returnTask(): void {
    this.isListOpen = false;
    this.isTaskOpen = true;
  };

  openClipboard(): void {
    const imageName = this.employees.foto_prancheta;
    window.open(`https://sameengenharia.com.br/api/task/file/${imageName}`, "_blank", "noopener,noreferrer");
  };

  applyFilters() {
    let data = [...this.filteredItems];

    if (this.costCenter && this.costCenter !== 'GERAL') {
      const inputValue = this.costCenter;
      data = data.filter(item =>
        item.centro_custo && item.centro_custo.includes(inputValue)
      );
    }

    this.items = data;
    this.isEmpty = this.items.length === 0;
  };

  setMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  };

  formateDate(date: string): string {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  formateCPF(cpf: string): string {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
  };

  calculateValueTask(): void {
    return this.employees.participantes.reduce((acc: number, item: any) => {
      return acc + item.valor
    }, 0);
  };
}

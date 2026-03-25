import { finalize } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { TaskService } from '../../services/task.service';
import { TitleService } from '../../../../core/services/title.service';

import { TaskItem, TaskCountStatus, MessageType } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit {

  private readonly _titleService = inject(TitleService);
  private readonly _taskService  = inject(TaskService);

  updateForm: FormGroup = new FormGroup({
    id:        new FormControl(''),
    status:    new FormControl('', Validators.required),
    observacao: new FormControl('', Validators.required),
  });

  items: TaskItem[]         = [];
  filteredItems: TaskItem[] = [];
  currentItem: TaskItem     = {} as TaskItem;

  countStatus: TaskCountStatus = {
    novo: 0, andamento: 0, concluido: 0, cancelado: 0,
  };

  employee:     string = '';
  activeStatus: string = '';

  menuModalOpen:       boolean = false;
  updateModalOpen:     boolean = false;
  employeesModalOpen:  boolean = false;

  isEmpty:     boolean = false;
  isLoading:   boolean = false;
  isSearching: boolean = false;

  message:     string      = '';
  showMessage: boolean     = false;
  messageType: MessageType = 'success';

  ngOnInit(): void {
    this._titleService.setTitle('Tarefas');
    this.findByStatus('NOVO');
    this.countByStatus();
  }

  findByStatus(status: string): void {
    this.items       = [];
    this.isEmpty     = false;
    this.isSearching = true;

    this._taskService.findByStatus(status)
      .pipe(finalize(() => (this.isSearching = false)))
      .subscribe({
        next: (res) => {
          this.items         = res.result;
          this.filteredItems = [...this.items];
          this.isEmpty       = this.items.length === 0;
          this.activeStatus  = status;
        },
        error: (err) => console.error(err.error.message, err),
      });
  }

  countByStatus(): void {
    this._taskService.countByStatus().subscribe({
      next:  (res) => (this.countStatus = res.result),
      error: (err) => console.error(err),
    });
  }

  update(): void {
    this.isLoading = true;

    const request = {
      id:        this.currentItem.id,
      status:    this.updateForm.value.status,
      observacao: this.updateForm.value.observacao,
    };

    this._taskService.update(request)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          this.resetUpdateForm();
          this.updateModalOpen = false;
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
      const nome = item.criador?.nome;
      if (!nome) return false;
      return nome.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(query);
    });
  }

  openMenu(item: TaskItem): void {
    this.menuModalOpen = true;
    this.currentItem   = item;
  }

  closeModals(): void {
    this.menuModalOpen      = false;
    this.updateModalOpen    = false;
    this.employeesModalOpen = false;
  }

  openUpdateModal(): void {
    this.menuModalOpen   = false;
    this.updateModalOpen = true;
    this.updateForm.patchValue({
      id:        this.currentItem.id,
      status:    this.currentItem.status,
      observacao: this.currentItem.observacao,
    });
  }

  openEmployeesModal(): void {
    this.menuModalOpen      = false;
    this.employeesModalOpen = true;
  }

  returnModal(): void {
    this.menuModalOpen   = true;
    this.updateModalOpen = false;
  }

  formateDate(date: string | null): string {
    if (!date) return 'N/A';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  totalValue(): number {
    return (this.currentItem.tarefa_participantes ?? [])
      .reduce((acc, item) => acc + (item.valor ?? 0), 0);
  }

  openClipboard(): void {
    const photo = this.currentItem.foto_prancheta;
    if (!photo) return;
    window.open(`https://sameengenharia.com.br/api/task/file/${photo}`, '_blank', 'noopener,noreferrer');
  }

  resetUpdateForm(): void {
    this.updateForm.reset({ status: '', observacao: '' });
  }

  setMessage(message: string, type: MessageType = 'success'): void {
    this.message     = message;
    this.messageType = type;
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
      this.message     = '';
    }, 3000);
  }
}

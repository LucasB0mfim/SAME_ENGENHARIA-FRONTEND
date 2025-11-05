import { finalize } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormsModule, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';

import { TaskService } from '../../../../core/services/task.service';
import { TitleService } from '../../../../core/services/title.service';

@Component({
  selector: 'app-task',
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {

  private readonly _titleService = inject(TitleService);
  private readonly _taskService = inject(TaskService);

  updateForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    status: new FormControl('', Validators.required),
    observacao: new FormControl('', Validators.required),
  });

  items: any[] = [];
  currentItem: any = {};
  filteredItems: any[] = [];

  employee: string = '';
  activeStatus: string = '';

  menuModalOpen: boolean = false;
  updateModalOpen: boolean = false;
  employeesModalOpen: boolean = false;

  isEmpty: boolean = false;
  isLoading: boolean = false;
  isSearching: boolean = false;

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this.findByStatus('NOVO');
    this._titleService.setTitle('Tarefas');
  }

  findByStatus(status: string): void {
    this.items = [];
    this.isEmpty = false;
    this.isSearching = true;

    this._taskService.findByStatus(status)
      .pipe(finalize(() => this.isSearching = false))
      .subscribe({
        next: (res) => {
          this.items = res.result;
          this.filteredItems = [...this.items];
          this.isEmpty = this.items.length === 0;
          this.activeStatus = status;
        },
        error: (err) => {
          console.error(err.error.message, err);
        }
      });
  };

  update(): void {
    this.isLoading = true;

    const request = {
      id: this.currentItem.id,
      status: this.updateForm.value.status,
      observacao: this.updateForm.value.observacao
    }

    this._taskService.update(request)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.resetUpdateForm();
          this.updateModalOpen = false;
          this.findByStatus(this.activeStatus);
          this.setMessage(res.message, 'success');
        },
        error: (err) => {
          console.log(err.error.message);
          this.setMessage(err.error.message, 'error');
        }
      });
  };

  applyFilters() {
    let data = [...this.filteredItems];

    if (this.employee) {
      const inputValue = this.employee
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      data = data.filter(item => {
        if (!item.colaborador) return false;

        const colaborador = item.colaborador
          .toUpperCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        return colaborador.includes(inputValue);
      });
    }

    this.items = data;
  };

  openMenu(item: any): void {
    this.menuModalOpen = true;
    this.currentItem = item;
  };

  closeModals(): void {
    this.menuModalOpen = false;
    this.updateModalOpen = false;
    this.employeesModalOpen = false;
  };

  openUpdateModal(): void {
    this.menuModalOpen = false;
    this.updateModalOpen = true;

    this.updateForm.patchValue({
      id: this.currentItem.id,
      status: this.currentItem.status,
      observacao: this.currentItem.observacao,
    });
  }

  openEmployeesModal(): void {
    this.menuModalOpen = false;
    this.employeesModalOpen = true;
  }

  returnModal(): void {
    this.menuModalOpen = true;
    this.updateModalOpen = false;
  }

  formateDate(date: string) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
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

  openClipboard(): void {
    const photo = this.currentItem.foto_prancheta;
    window.open(`https://sameengenharia.com.br/api/task/file/${photo}`, "_blank", "noopener,noreferrer");
  };

  resetUpdateForm(): void {
    this.updateForm.reset({
      criador: '',
      status: '',
      advertencia: '',
      observacao: ''
    })
  }
}


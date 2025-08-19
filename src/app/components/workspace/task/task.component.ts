import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { TitleService } from '../../../core/services/title.service';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task',
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private _taskService = inject(TaskService);

  // ========== ESTADOS ========== //
  items: any[] = [];

  isCreate: boolean = false;
  isUpdate: boolean = false;
  isDelete: boolean = false;

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  // ========== HOOK ========== //
  ngOnInit(): void {
    this._titleService.setTitle('Tarefa');
    this.getTask();
  }

  // ========== API ========== //
  getTask(): void {
    this._taskService.getTask().subscribe({
      next: (res) => {
        this.items = res.result;
      }
    });
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

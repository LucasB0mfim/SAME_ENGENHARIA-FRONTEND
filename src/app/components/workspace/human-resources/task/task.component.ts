import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';

import { TaskService } from '../../../../core/services/task.service';
import { TitleService } from '../../../../core/services/title.service';
import { DynamicListComponent } from '../../../dynamic-list/dynamic-list.component';
import { DynamicListConfig } from '../../../dynamic-list/dynamic-list.models';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [MatIconModule, DynamicListComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {

  private readonly _titleService = inject(TitleService);
  private readonly _taskService = inject(TaskService);

  items: any[] = [];
  activeStatus = '';
  isSearching = false;

  listConfig: DynamicListConfig = {
    statusButtons: [
      { label: 'Novos', value: 'NOVO' },
      { label: 'Em andamento', value: 'ANDAMENTO' },
      { label: 'Concluídos', value: 'CONCLUIDO' },
      { label: 'Cancelados', value: 'CANCELADO' },
    ],

    onStatusChange: (status) => this.findByStatus(status),

    cardHeader: {
      title: item => item.empData.nome,
      subtitles: [item => item.empData.funcao, item => item.centro_custo],
    },
  };

  ngOnInit(): void {
    this._titleService.setTitle('Tarefas');
    this.findByStatus('NOVO');
  }

  findByStatus(status: string): void {
    this.items = [];
    this.isSearching = true;
    this.activeStatus = status;

    this._taskService.findByStatus(status)
      .pipe(finalize(() => this.isSearching = false))
      .subscribe({
        next: res => { this.items = res.result; },
        error: err => console.error(err.error.message, err),
      });
  }

  formateDate(date: string): string {
    if (!date) return 'N/A';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }
}

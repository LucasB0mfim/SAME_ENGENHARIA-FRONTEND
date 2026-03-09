import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';

import { BrkService } from '../../../../core/services/brk.service';
import { TitleService } from '../../../../core/services/title.service';
import { DynamicListComponent } from '../../../dynamic-list/dynamic-list.component';
import { DynamicListConfig } from '../../../dynamic-list/dynamic-list.models';

@Component({
  selector: 'app-brk',
  standalone: true,
  imports: [
    MatIconModule,
    DynamicListComponent
  ],
  templateUrl: './brk.component.html',
  styleUrl: './brk.component.scss'
})
export class BrkComponent implements OnInit {

  private readonly _titleService = inject(TitleService);
  private readonly _brkService = inject(BrkService);

  items: any[] = [];
  activeStatus = '';
  isSearching = false;

  listConfig: DynamicListConfig = {
    statusButtons: [
      { label: 'Novos', value: 'NOVO' },
      { label: 'Pesquisa Social', value: 'PESQUISA SOCIAL' },
      { label: 'Documentação', value: 'DOCUMENTACAO' },
      { label: 'Integração', value: 'INTEGRACAO' },
      { label: 'Liberados', value: 'LIBERADO' },
      { label: 'Pausados', value: 'PAUSADO' },
      { label: 'Cancelados', value: 'CANCELADO' },
    ],

    onStatusChange: (status) => this.findByStatus(status),

    cardHeader: {
      title: item => item.nome,
      subtitles: [item => item.funcao, item => item.centro_custo],
    },
  };

  ngOnInit(): void {
    this._titleService.setTitle('BRK');
    this.findByStatus('NOVO');
  }

  findByStatus(status: string): void {
    this.items = [];
    this.isSearching = true;
    this.activeStatus = status;

    this._brkService.findByStatus(status)
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

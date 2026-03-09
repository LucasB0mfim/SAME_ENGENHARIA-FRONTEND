import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';

import { TitleService } from '../../../../core/services/title.service';
import { ResignationService } from '../../../../core/services/resignation.service';
import { DynamicListComponent } from '../../../dynamic-list/dynamic-list.component';
import { DynamicListConfig } from '../../../dynamic-list/dynamic-list.models';

@Component({
  selector: 'app-resignation',
  standalone: true,
  imports: [MatIconModule, DynamicListComponent],
  templateUrl: './resignation.component.html',
  styleUrl: './resignation.component.scss'
})
export class ResignationComponent implements OnInit {

  private readonly _titleService = inject(TitleService);
  private readonly _resignationService = inject(ResignationService);

  items: any[] = [];
  activeStatus = '';
  isSearching = false;

  listConfig: DynamicListConfig = {
    statusButtons: [
      { label: 'Novos', value: 'NOVO' },
      { label: 'Em andamento', value: 'ANDAMENTO' },
      { label: 'Aviso Trabalhado', value: 'AVISO TRABALHADO' },
      { label: 'Demitido', value: 'DEMITIDO' },
      { label: 'Desligado', value: 'DESLIGADO' },
    ],

    onStatusChange: (status) => this.findByStatus(status),

    cardHeader: {
      title: item => item.nome,
      subtitles: [item => item.funcao, item => item.centro_custo],
    },
  };

  ngOnInit(): void {
    this._titleService.setTitle('Desligamento');
    this.findByStatus('NOVO');
  }

  findByStatus(status: string): void {
    this.items = [];
    this.isSearching = true;
    this.activeStatus = status;

    this._resignationService.findByStatus(status)
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

import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';

import { TitleService } from '../../../../core/services/title.service';
import { ExperienceService } from '../../../../core/services/experience.service';
import { DynamicListComponent } from '../../../dynamic-list/dynamic-list.component';
import { DynamicListConfig } from '../../../dynamic-list/dynamic-list.models';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    MatIconModule,
    DynamicListComponent
  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {
  private readonly _titleService = inject(TitleService);
  private readonly _experienceService = inject(ExperienceService);

  items: any[] = [];
  activeStatus = '';
  isSearching = false;

  listConfig: DynamicListConfig = {
    statusButtons: [
      { label: 'Novos', value: 'NOVO' },
      { label: 'Em andamento', value: 'ANDAMENTO' },
      { label: 'Concluídos', value: 'CONCLUIDO' }
    ],

    onStatusChange: (status) => this.findByStatus(status),

    cardHeader: {
      title: item => item.nome,
      subtitles: [item => item.chapa, item => item.funcao],
    },
  };

  ngOnInit(): void {
    this._titleService.setTitle('Experiência');
    this.findByStatus('NOVO');
  }

  findByStatus(status: string): void {
    this.items = [];
    this.isSearching = true;
    this.activeStatus = status;

    this._experienceService.findByStatus(status)
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

import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';

import { TitleService } from '../../../../core/services/title.service';
import { AdmissionService } from '../../../../core/services/admission.service';
import { DynamicListComponent } from '../../../dynamic-list/dynamic-list.component';
import { DynamicListConfig } from '../../../dynamic-list/dynamic-list.models';

@Component({
  selector: 'app-admission',
  standalone: true,
  imports: [MatIconModule, DynamicListComponent],
  templateUrl: './admission.component.html',
  styleUrl: './admission.component.scss'
})
export class AdmissionComponent implements OnInit {

  private readonly _titleService = inject(TitleService);
  private readonly _admissionService = inject(AdmissionService);

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
      title: item => item.nome,
      subtitles: [item => item.funcao],
    },
  };

  ngOnInit(): void {
    this._titleService.setTitle('Admissão');
    this.findByStatus('NOVO');
  }

  findByStatus(status: string): void {
    this.items = [];
    this.isSearching = true;
    this.activeStatus = status;

    this._admissionService.findByStatus(status)
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

  formatePhone(phone: string): string {
    if (!phone) return 'N/A';
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  }

  openClipboard(url: string): void {
    if (!url) return;
    window.open(`https://sameengenharia.com.br/api/admission/file/${url}`, '_blank', 'noopener,noreferrer');
  }

  openRGFront(item: any): void {
    window.open(`https://sameengenharia.com.br/api/admission/file/${item.foto_rg_frente}`, '_blank', 'noopener,noreferrer');
  }

  openRGBack(item: any): void {
    window.open(`https://sameengenharia.com.br/api/admission/file/${item.foto_rg_verso}`, '_blank', 'noopener,noreferrer');
  }
}

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../core/services/title.service';
import { ExperienceService } from '../../../core/services/experience.service';

@Component({
  selector: 'app-work-modality',
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './work-modality.component.html',
  styleUrl: './work-modality.component.scss'
})
export class WorkModalityComponent implements OnInit {

  // INJEÇÃO DE DEPÊNCIAS
  private _titleService = inject(TitleService);
  private readonly _experienceService = inject(ExperienceService);

  // VARIÁVEL PARA ARMAZENAR OS DADOS DA API
  item: any[] = [];

  // VARIÁVEL PARA LISTA VAZIA
  isEmpty: boolean = false;

  // VARIÁVEL PARA CARREGAMENTO
  isLoading: boolean = true;

  // HOOK DE CICLO //
  ngOnInit() {
    this._titleService.setTitle('Definir Modalidade de Trabalho');
    this.getEmployees();
  }

  // BUSCAR FUNCIONÁRIOS //
  getEmployees() {
    this._experienceService.find().subscribe({
      next: (data) => {
        this.item = data.records;
        this.isLoading = false;
        this.isEmpty = this.item.length === 0;
      },
      error: (error) => {
        this.isEmpty = true;
        this.isLoading = false;
        console.error('Fala ao buscar dados dos funcionários: ', error);
      }
    })

  }
}

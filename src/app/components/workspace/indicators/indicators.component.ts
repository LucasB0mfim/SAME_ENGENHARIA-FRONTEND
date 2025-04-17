import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';

import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'app-indicators',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './indicators.component.html',
  styleUrl: './indicators.component.scss'
})
export class IndicatorsComponent implements OnInit {

  // INJEÇÃO DE DEPENDÊNCIA
  private _titleService = inject(TitleService);

  // HOOK DE CICLO
  ngOnInit() {
    this._titleService.setTitle('Indicadores')
  }
}

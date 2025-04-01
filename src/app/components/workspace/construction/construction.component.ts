import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';

import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'app-construction',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './construction.component.html',
  styleUrl: './construction.component.scss'
})
export class ConstructionComponent implements OnInit {
  private _titleService = inject(TitleService);

  ngOnInit() {
    this._titleService.setTitle('Obra')
  }
}

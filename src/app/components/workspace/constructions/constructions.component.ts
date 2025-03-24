import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';

import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'app-constructions',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './constructions.component.html',
  styleUrl: './constructions.component.scss'
})
export class ConstructionsComponent implements OnInit {
  private _titleService = inject(TitleService);

  ngOnInit() {
    this._titleService.setTitle('Obras')
  }
}

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';

import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'app-ti',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './ti.component.html',
  styleUrl: './ti.component.scss'
})
export class TiComponent implements OnInit {
  private _titleService = inject(TitleService);

  ngOnInit() {
    this._titleService.setTitle('T.I');
  }
}

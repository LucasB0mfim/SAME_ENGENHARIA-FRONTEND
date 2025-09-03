import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';

import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'app-buy',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './buy.component.html',
  styleUrl: './buy.component.scss'
})
export class BuyComponent {
  private _titleService = inject(TitleService);

  ngOnInit() {
    this._titleService.setTitle('Compras')
  }
}

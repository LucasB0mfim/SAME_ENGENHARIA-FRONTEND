import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  private _titleService = inject(TitleService);

  ngOnInit() {
    this._titleService.setTitle('Relatórios')
  }
}

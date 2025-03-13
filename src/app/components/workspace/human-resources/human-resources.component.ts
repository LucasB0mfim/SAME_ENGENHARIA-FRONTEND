import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'app-human-resources',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './human-resources.component.html',
  styleUrl: './human-resources.component.scss'
})
export class HumanResourcesComponent implements OnInit {
  private _titleService = inject(TitleService);

  ngOnInit() {
    this._titleService.setTitle('Recursos Humanos')
  }
}

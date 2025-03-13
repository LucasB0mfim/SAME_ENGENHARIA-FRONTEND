import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TitleService } from '../../../core/services/title.service';
import { ExperienceService } from '../../../core/services/experience.service';

import { IExperienceRecord } from '../../../core/interfaces/experience-response.interface';


@Component({
  selector: 'app-experience',
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {
  private readonly _experienceService = inject(ExperienceService);
  private readonly _titleService = inject(TitleService);
  records: IExperienceRecord[] = [];

  ngOnInit() {
    this._titleService.setTitle('Experiência');
    this.load();
  }

  load() {
    this._experienceService.findAll().subscribe({
      next: (data) => {
        this.records = data.records;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}

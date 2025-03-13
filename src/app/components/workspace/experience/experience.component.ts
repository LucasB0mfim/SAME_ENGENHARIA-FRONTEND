import { differenceInCalendarDays } from 'date-fns';

import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { TitleService } from '../../../core/services/title.service';
import { ExperienceService } from '../../../core/services/experience.service';

import { IExperienceRecord } from '../../../core/interfaces/experience-response.interface';


@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {

  records: IExperienceRecord[] = [];
  private readonly _experienceService = inject(ExperienceService);
  private readonly _titleService = inject(TitleService);

  ngOnInit() {
    this.load();
    this._titleService.setTitle('Experiência');
  }

  load() {
    this._experienceService.find().subscribe({
      next: (data) => { this.records = data.records },
      error: (error) => { console.error(error) }
    });
  }

  experienceTime(admissionDate: Date): number {
    const currentDate = new Date();
    const admission = new Date(admissionDate);
    return differenceInCalendarDays(currentDate, admission);
  }

  borderExperience(admissionDate: Date) {
    const days = this.experienceTime(admissionDate);

    if (days <= 30) {
      return 'one-month';
    } else if (days <= 60) {
      return 'two-months';
    } else if (days <= 90) {
      return 'three-months';
    } else {
      return 'many-months';
    }
  }
}

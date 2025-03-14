import { differenceInCalendarDays } from 'date-fns';

import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { TitleService } from '../../../core/services/title.service';
import { ExperienceService } from '../../../core/services/experience.service';

import { IExperienceRecord } from '../../../core/interfaces/experience-response.interface';
import { Data } from '@angular/router';
import { first } from 'rxjs';


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

  experienceTime(experienceDate: Date): number {
    const today = new Date();
    const period = new Date(experienceDate);
    return differenceInCalendarDays(period, today) + 1;
  }

  borderExperience(firstExperience: Date, secondExperience: Date) {
    const firstDate = this.experienceTime(firstExperience);
    const secondDate = this.experienceTime(secondExperience);

    if (firstDate > 0 || secondDate > 0) {
      if ((firstDate > 0 && firstDate <= 10) || (secondDate > 0 && secondDate <= 10)) {
        return 'red';
      } else {
        return 'greenLight';
      }
    } else {
      return 'blue';
    }
  }

}

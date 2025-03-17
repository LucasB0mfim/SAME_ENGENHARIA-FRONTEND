import { differenceInCalendarDays } from 'date-fns';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';

import { TitleService } from '../../../core/services/title.service';
import { ExperienceService } from '../../../core/services/experience.service';

import { IExperienceRecord } from '../../../core/interfaces/experience-response.interface';


@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {

  employeeName: string = '';
  centroCustoName: string = '';
  isSelectOpen: boolean = false;
  experienceFilter: string = 'all';
  records: IExperienceRecord[] = [];
  allRecords: IExperienceRecord[] = []; // Armazena todos os registros originais
  private readonly _experienceService = inject(ExperienceService);
  private readonly _titleService = inject(TitleService);
  @ViewChild('situacaoSelect') situacaoSelect: ElementRef | undefined;

  ngOnInit() {
    this.load();
    this._titleService.setTitle('Experiência');
  }

  load() {
    this._experienceService.find().subscribe({
      next: (data) => {
        this.records = data.records;
        this.allRecords = [...data.records]
      },
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

  isInExperience(data: IExperienceRecord): boolean {
    const firstDate = this.experienceTime(data['PRIMEIRO PERIODO']);
    const secondDate = this.experienceTime(data['SEGUNDO PERIODO']);
    return firstDate > 0 || secondDate > 0;
  }

  filters() {
    let filteredRecords = [...this.allRecords];

    // Busca por nome
    if (this.employeeName) {
      const inputValue = this.employeeName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.FUNCIONARIO.toLowerCase().includes(inputValue)
      );
    }

    // Busca por Centro de Custo
    if (this.centroCustoName) {
      const inputValue = this.centroCustoName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data['CENTRO DE CUSTO'].toLowerCase().includes(inputValue)
      );
    }

    // Busca por experiência
    if (this.experienceFilter === 'withExperience') {
      filteredRecords = filteredRecords.filter(data => this.isInExperience(data));
    } else if (this.experienceFilter === 'withoutExperience') {
      filteredRecords = filteredRecords.filter(data => !this.isInExperience(data));
    }

    this.records = filteredRecords;
    this.isSelectOpen = false;
  }

  searchEmployee() {
    this.filters();
  }

  searchCentroCusto() {
    this.filters();
  }

  toggleSelect() {
    setTimeout(() => {
      this.isSelectOpen = !this.isSelectOpen;
    }, 0);
  }
}

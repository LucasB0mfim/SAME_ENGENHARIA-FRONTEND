import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { differenceInCalendarDays } from 'date-fns';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';

import { TitleService } from '../../../core/services/title.service';
import { ExperienceService } from '../../../core/services/experience.service';

import { IExperienceRecord } from '../../../core/interfaces/experience-response.interface';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private readonly _service = inject(ExperienceService);


  // ========== ESTADOS ========== //
  items: any[] = [];
  filteredItem: any[] = [];

  employee: string = '';
  cost_center: string = '';
  experienceFilter: string = 'all';

  isLoading: boolean = false;
  isEmpty: boolean = false;

  // ========== HOOK ========== //
  ngOnInit(): void {
    this._titleService.setTitle('Experiência');
    this.getData();
  }

  // ========== API ========== //
  getData(): void {
    this.isLoading = true;

    this._service.find().subscribe({
      next: (data) => {
        this.items = data.records;
        this.filteredItem = [...this.items];
        this.isLoading = false;
        if (this.filteredItem.length === 0) this.isEmpty = true;
      },
      error: (error) => {
        console.error('Erro ao buscar dados.', error);
        this.isLoading = false;
        this.isEmpty = true;
      }
    })
  }

  downloadExcel(): void {
    this._service.getExcel().subscribe((blob: Blob) => {
      saveAs(blob, 'experiência.xlsx');
    });
  }

  // ========== BUSCAR COLABORADOR ========== //
  applyFilters(): void {
    this.filteredItem = this.items.filter((item) => {
      const matchEmployee = this.employee
        ? item.funcionario?.toLowerCase().includes(this.employee.toLowerCase())
        : true;

      const matchCostCenter = this.cost_center
        ? item.centro_custo?.toLowerCase().includes(this.cost_center.toLowerCase())
        : true;

      const matchStatus = this.experienceFilter === 'all' ||
        (this.experienceFilter === 'withExperience' && item.primeiro_periodo) ||
        (this.experienceFilter === 'withoutExperience' && !item.primeiro_periodo);

      return matchEmployee && matchCostCenter && matchStatus;
    });

    this.isEmpty = this.filteredItem.length === 0;
  }


  // ========== UTILITÁRIOS ========== //
  borderExperience(firstExperience: string, secondExperience: string) {
    const firstDate = this.experienceTime(firstExperience);
    const secondDate = this.experienceTime(secondExperience);

    if (firstDate > 0 || secondDate > 0) {
      if ((firstDate > 0 && firstDate <= 10) || (secondDate > 0 && secondDate <= 10)) {
        return 'red';
      } else {
        return 'green';
      }
    } else {
      return 'orange';
    }
  }

  experienceTime(experienceDate: string): number {
    const today = new Date();
    const period = this.parseBrazilianDate(experienceDate);
    return differenceInCalendarDays(period, today) + 1;
  }

  parseBrazilianDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  isInExperience(data: IExperienceRecord): boolean {
    const firstDate = this.experienceTime(data.primeiro_periodo);
    const secondDate = this.experienceTime(data.segundo_periodo);
    return firstDate > 0 || secondDate > 0;
  }
}

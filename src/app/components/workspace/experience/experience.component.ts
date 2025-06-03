import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { differenceInCalendarDays } from 'date-fns';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';

import { TitleService } from '../../../core/services/title.service';
import { ExperienceService } from '../../../core/services/experience.service';

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
  costCenter: any[] = [];

  employeeFilter: string = '';
  costCenterFilter: string = '';
  experienceFilter: string = 'all';

  isLoading: boolean = false;
  isGenerating: boolean = false;
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
        this.removeDuplicates();
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
    this.isGenerating = true;

    this._service.getExcel().subscribe((blob: Blob) => {
      saveAs(blob, 'experiência.xlsx');
      this.isGenerating = false;
    });
  }

  // ========== BUSCAR COLABORADOR ========== //
  applyFilters() {
    let data = [...this.filteredItem];

    if (this.employeeFilter) {
      const inputValue = this.employeeFilter.toLowerCase();
      data = data.filter(data =>
        data.funcionario.toLowerCase().includes(inputValue)
      );
    }

    if (this.costCenterFilter) {
      const inputValue = this.costCenterFilter.toLowerCase();
      data = data.filter(data =>
        data.centro_custo.toLowerCase().includes(inputValue)
      );
    }

    if (this.experienceFilter === 'withExperience') {
      data = data.filter(data => this.isInExperience(data));
    } else if (this.experienceFilter === 'withoutExperience') {
      data = data.filter(data => !this.isInExperience(data));
    }

    this.items = data;
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

  isInExperience(data: any): boolean {
    const firstDate = this.experienceTime(data.primeiro_periodo);
    const secondDate = this.experienceTime(data.segundo_periodo);
    return firstDate > 0 || secondDate > 0;
  }

  removeDuplicates(): void {
    const costCenterUnique = new Set<string>();

    this.items.forEach((item) => {
      if (item.centro_custo) {
        costCenterUnique.add(item.centro_custo)
      }
    })

    this.costCenter = Array.from(costCenterUnique).sort();
  }
}

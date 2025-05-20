import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { differenceInCalendarDays } from 'date-fns';
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
  allRecords: IExperienceRecord[] = [];
  isLoading: boolean = false;

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
        this.allRecords = [...data.records];
      },
      error: (error) => { console.error(error); }
    });
  }

  downloadExcel(): void {
    this.isLoading = true;
    this._experienceService.getExcel().subscribe((blob: Blob) => {
      saveAs(blob, 'experiência.xlsx');
      this.isLoading = false;
    });
  }

  // Função auxiliar para converter data no formato brasileiro (DD/MM/YYYY) para Date
  parseBrazilianDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // month - 1 porque o Date usa 0-11 para meses
  }

  experienceTime(experienceDate: string): number {
    const today = new Date();
    const period = this.parseBrazilianDate(experienceDate);
    return differenceInCalendarDays(period, today) + 1;
  }

  borderExperience(firstExperience: string, secondExperience: string) {
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
    const firstDate = this.experienceTime(data.primeiro_periodo);
    const secondDate = this.experienceTime(data.segundo_periodo);
    return firstDate > 0 || secondDate > 0;
  }

  filters() {
    let filteredRecords = [...this.allRecords];

    // Busca por nome
    if (this.employeeName) {
      const inputValue = this.employeeName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.funcionario.toLowerCase().includes(inputValue)
      );
    }

    // Busca por Centro de Custo
    if (this.centroCustoName) {
      const inputValue = this.centroCustoName.toLowerCase();
      filteredRecords = filteredRecords.filter(data =>
        data.centro_custo.toLowerCase().includes(inputValue)
      );
    }

    // Busca por experiência
    if (this.experienceFilter === 'withExperience') {
      filteredRecords = filteredRecords.filter(data => this.isInExperience(data));
    } else if (this.experienceFilter === 'withoutExperience') {
      filteredRecords = filteredRecords.filter(data => !this.isInExperience(data));
    }

    this.records = filteredRecords;

    // Quando um item é selecionado, o select fecha
    this.isSelectOpen = false;
  }

  searchEmployee() {
    this.filters();
  }

  searchCentroCusto() {
    this.filters();
  }

  toggleSelect() {
    // O mousedown ocorre antes do select realmente abrir ou fechar
    // Então invertemos o estado atual
    setTimeout(() => {
      this.isSelectOpen = !this.isSelectOpen;
    }, 0);
  }

  resetSelectIcon() {
    // Quando o select perde o foco (clique fora), o ícone retorna à posição original
    this.isSelectOpen = false;
  }
}

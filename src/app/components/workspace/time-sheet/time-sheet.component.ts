import { saveAs } from 'file-saver';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { TimesheetService } from '../../../core/services/timesheet.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ICommonData } from '../../../core/interfaces/timesheet-response.interface';

@Component({
  selector: 'app-time-sheet',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './time-sheet.component.html',
  styleUrl: './time-sheet.component.scss'
})
export class TimeSheetComponent implements OnInit {

  // CHAMANDO OS SERVIÇOS
  private _titleService = inject(TitleService);
  private readonly _timesheetService = inject(TimesheetService);

  // CRIANDO UM FORMULÁRIO PARA ENVIAR OS FILTROS
  filterForm: FormGroup = new FormGroup({
    costCenter: new FormControl('Geral'),
    status: new FormControl('Geral'),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    employee: new FormControl('')
  })

  createLayoutTOTVSForm: FormGroup = new FormGroup({
    date: new FormControl(''),
    workingDays: new FormControl('')
  })

  // VARIÁVEL DE CARREGAMENTO
  isLoading: boolean = true;
  isCreating: boolean = false;

  holidays: string[] = [];

  // VARIÁVEL DE LISTA VAZIA
  isVoid: boolean = false;

  // VARIÁVEL PARA ARMAZENAR OS REGISTROS
  item: any[] = [];
  costCenter: string[] = [];

  // VARIÁVEL PARA ARMAZENAR OS REGISTROS PELO NOME
  employeeHistory: Record<string, ICommonData> = {};

  // ABRIR O CORPO DO CARD
  index: number | null = null;

  // ANIMAÇÃO DA SETA DO SELECT
  statusArrow: boolean = false;

  // VARIÁVEL PARA ARMAZENAR OS ITENS FILTRADOS
  employeeFilter: any[] = [];

  downloadSection: boolean = false;

  ngOnInit(): void {
    this.getTimesheet();
    this._titleService.setTitle('Monitorar Ponto');
  }

  // BUSCAR TODOS OS REGISTROS DE PONTO //

  getTimesheet() {
    this._timesheetService.findAll().subscribe({
      next: (data) => {
        this.item = data.records;
        this.employeeFilter = [...this.item];

        this.groupByEmployee();
        this.removeDuplicate();

        this.isLoading = false;
        if (this.item.length === 0) this.isVoid = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.isVoid = true;
        console.error('Não foi possível carregar os dados: ', error)
      }
    })
  }

  downloadLayoutTOTVS(): void {
    this.isCreating = true;

    const request = {
      date: this.createLayoutTOTVSForm.value.date,
      workingDays: this.createLayoutTOTVSForm.value.workingDays,
      holidays: this.holidays.filter(holiday => holiday !== '') // Remove datas vazias
    };

    this._timesheetService.donwloadLayoutTOTVS(request).subscribe({
      next: (blob: Blob) => {
        this.isCreating = false;
        saveAs(blob, 'layout_ponto_totvs.txt');
        this.resetLayoutTOTVSForm();
      },
      error: (error) => {
        console.error(error);
        this.isCreating = false;
      }
    });
  }

  // AGRUPAR POR NOME //

  groupByEmployee() {
    this.employeeHistory = this.employeeFilter.reduce((acc: any, item: any) => {
      if (!acc[item.nome]) {
        acc[item.nome] = {
          chapa: item.chapa,
          nome: item.nome,
          records: []
        }
      }

      acc[item.nome].records.push({
        periodo: item.periodo,
        jornada_realizada: item.jornada_realizada,
        falta: item.falta,
        evento_abono: item.evento_abono
      });

      return acc;
    }, {});
  }

  // CALCULAR TOTAL DE FALTAS //

  faultCounter(employeeName: string): number {
    return this.employeeHistory[employeeName].records.filter(item =>
      item.jornada_realizada.split(':')[0] <= '03' && item.evento_abono === 'NÃO CONSTA'
    ).length
  }

  // CALCULAR TOTAL DE ATESTADOS //

  certificateCounter(employeeName: string): number {
    return this.employeeHistory[employeeName].records.filter(item =>
      item.evento_abono === 'Atestado Médico'
    ).length
  }

  // CALCULAR TOTAL DE ABONOS //

  abonoCounter(employeeName: string): number {
    return this.employeeHistory[employeeName].records.filter(item =>
      item.evento_abono === 'Gestor decidiu abonar'
    ).length
  }

  // CALCULAR TOTAL DE DIAS EXTRAS //

  extraDayCounter(employeeName: string): number {
    return this.employeeHistory[employeeName].records.filter(item =>
      item.evento_abono === 'Dia extra'
    ).length
  }

  // FORMATAR DATA //

  formateDate(date: string): String {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`
  }

  // MÉTODO PARA PESQUISAR COM FILTRO //

  onSearch() {
    // Chama o loading
    this.isLoading = true;
    // Apaga o card de vazio
    this.isVoid = false;
    // Limpa a lista atual
    this.item = [];
    // Limpa o histórico agrupado
    this.employeeHistory = {};

    const request = {
      costCenter: this.filterForm.value.costCenter,
      status: this.filterForm.value.status,
      startDate: this.filterForm.value.startDate,
      endDate: this.filterForm.value.endDate
    };

    this._timesheetService.findByFilter(request).subscribe({
      next: (data) => {
        this.item = data.records;
        this.employeeFilter = [...this.item];
        this.groupByEmployee();
        this.isLoading = false;
        if (this.item.length === 0) this.isVoid = true;
      },
      error: (error) => {
        console.error('Erro ao buscar registros filtrados:', error);
        this.isLoading = false;
        this.isVoid = true;
      }
    });
  }

  // MÉTODO PARA LIMPAR OS INPUTS DO FILTRO //

  onClear() {
    // Chama o loading
    this.isLoading = true;
    // Apaga o card de vazio
    this.isVoid = false;
    // Limpa a lista atual
    this.item = [];
    // Limpa o histórico agrupado
    this.employeeHistory = {};

    this.filterForm.reset({
      costCenter: 'Geral',
      status: 'Geral',
      startDate: '',
      endDate: ''
    });

    this.getTimesheet();
  }

  // MÉTODO PARA UTILIZAR FILTROS DE BUSCA //

  applyFilters() {
    const searchTerm = this.filterForm.get('employee')?.value?.trim() || '';

    if (!searchTerm) {
      // Se o campo estiver vazio, mostra todos os registros
      this.employeeFilter = [...this.item];
      this.groupByEmployee();
      this.isVoid = this.employeeFilter.length === 0;
      return;
    }

    const filteredItems = this.item.filter(item =>
      item.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.employeeFilter = filteredItems;
    this.groupByEmployee();

    this.isVoid = this.employeeFilter.length === 0;
    this.index = null;
  }

  // MÉTODO PARA ABRIR CARD //

  openCard(cardIndex: number, event?: Event) {
    if (event) event.stopPropagation();

    if (this.index === cardIndex) {
      this.index = null;
    } else {
      this.index = cardIndex;
    }
  }

  // REMOVE CENTRO DE CUSTOS DUPLICADOS //

  removeDuplicate(): void {
    const costCenterSet = new Set<string>();

    this.item.forEach(item => {
      if (item.centro_custo &&
        item.centro_custo.trim() !== '' &&
        item.centro_custo !== 'NÃO CONSTA') {
        costCenterSet.add(item.centro_custo);
      }
    });

    this.costCenter = Array.from(costCenterSet).sort();
  }

  addHoliday(): void {
    this.holidays.push('');
  }

  removeHoliday(index: number): void {
    this.holidays.splice(index, 1);
  }

  updateHoliday(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.holidays[index] = target.value;
  }

  // Atualize o método resetLayoutTOTVSForm:
  resetLayoutTOTVSForm(): void {
    this.createLayoutTOTVSForm.reset({
      date: null,
      workingDays: null
    });
    this.holidays = [];
  }
}

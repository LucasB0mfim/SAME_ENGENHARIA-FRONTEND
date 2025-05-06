import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../core/services/title.service';
import { BenefitService } from '../../../core/services/benefit.service';


@Component({
  selector: 'app-benefit',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './benefit.component.html',
  styleUrl: './benefit.component.scss'
})
export class BenefitComponent implements OnInit {

  // VARIÁVEL PARA ARMAZENAR DADOS
  items: any[] = [];
  employees: any[] = [];

  // VARIÁVEIS DE ESTADO
  activeButton: string = 'geral';
  geralSection: boolean = true;
  recordsSection: boolean = false;
  employeesSection: boolean = false;

  // VARIÁVEL DE CARREGAMENTO CARREGAMENTO
  isLoading: boolean = false;

  // VARIÁVEL PARA AVISO
  isAlert: boolean = true;

  // VARIÁVEIS PARA TOTAIS
  totalVR: number = 0;
  totalVT: number = 0;
  totalVC: number = 0;
  totalCost: number = 0;

  // INJEÇÃO DE DEPENDÊNCIAS
  private _titleService = inject(TitleService);
  private readonly _benefitService = inject(BenefitService);

  // FORMULÁRIO //

  recordForm: FormGroup = new FormGroup({
    date: new FormControl()
  })

  // HOOK DE CICLO //

  ngOnInit(): void {
    this._titleService.setTitle('Periféricos');
  }

  // BUSCAR COLABORADORES //

  getEmployees() {
    this.employees = [];
    this.isLoading = true;

    this._benefitService.findAll().subscribe({
      next: (data) => {
        this.employees = data.result;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      }
    })
  }

  // BUSCAR COLABORADORES + DIAS ÚTEIS //

  getRecordByDate() {
    this.items = [];
    this.isAlert = false;
    this.isLoading = true;

    const request = {
      date: this.recordForm.value.date
    }

    this._benefitService.sendDate(request).subscribe({
      next: (data) => {
        this.items = data.result;
        this.isLoading = false;
        this.calculateTotals(); // Calcular os totais ao receber os dados
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    })
  }

  // CALCULAR TOTAIS GERAIS //

  calculateTotals() {
    this.totalVR = 0;
    this.totalVT = 0;
    this.totalVC = 0;
    this.totalCost = 0;

    if (this.items && this.items.length > 0) {
      this.items.forEach(item => {
        const diasUteis = item.dias_uteis;
        const vr = item.vale_refeicao_dia;
        const vt = item.vale_transporte_dia;
        const vc = item.vale_combustivel_dia;

        this.totalVR += vr * diasUteis;
        this.totalVT += vt * diasUteis;
        this.totalVC += vc * diasUteis;
        this.totalCost = this.totalVR + this.totalVT + this.totalVC;
      });
    }
  }

  // MOSTRAR SEÇÃO GERAL //

  showGeral():void {
    this.recordsSection = false;
    this.employeesSection = false;
    this.geralSection = true;
    this.activeButton = 'geral';
  }

  // MOSTRAR SEÇÃO REGISTROS //

  showRecords(): void {
    this.employeesSection = false;
    this.geralSection = false;
    this.recordsSection = true;
    this.activeButton = 'records';
  }

  // MOSTRAR SEÇÃO COLABORADORES //

  showEmployees(): void {
    this.recordsSection = false;
    this.geralSection = false;
    this.employeesSection = true;
    this.activeButton = 'employees';
    this.getEmployees();
  }

  // FORMATAR DATA //

  formatedDate(date: Date): string {
    const [year, month] = String(date).split('-');
    return `${month}/${year}`;
  }

  // CALCULAR GASTO MENSAL //

  totalMonth(workDays: number, benefit: number): string {
    if (workDays) {
      return (benefit * workDays).toFixed(2);
    } else {
      return '0.00';
    }
  }

  // CALCULAR GASTO TOTAL //

  totalExpense(workDays: number, vr: number, vt: number, vc: number): string {
    if (workDays) {
      return (vr * workDays + vt * workDays + vc * workDays).toFixed(2);
    } else {
      return '0.00';
    }
  }
}

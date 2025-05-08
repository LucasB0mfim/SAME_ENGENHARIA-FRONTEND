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

  // VARIÁVEL DE CARREGAMENTO
  isLoading: boolean = false;

  // VARIÁVEL PARA AVISO
  isAlert: boolean = true;

  // VARIÁVEL PARA GERENCIAR MODAL
  addEmployee: boolean = false;

  // VARIÁVEIS DE SUCESSO E ERRO
  errorMessage: string = '';
  successMessage: string = '';
  showError: boolean = false;
  showSuccess: boolean = false;

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

  employeeForm: FormGroup = new FormGroup({
    nome: new FormControl(null),
    posicao: new FormControl(''),
    setor: new FormControl(''),
    contrato: new FormControl(''),
    centro_custo: new FormControl(''),
    vr: new FormControl(null),
    vt: new FormControl(null),
    vc: new FormControl(null),
    vem: new FormControl(null)
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

    this._benefitService.createRecord(request).subscribe({
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

  // FORMATAR PREÇO //

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // MOSTRAR SEÇÃO GERAL //

  showGeral(): void {
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

  // MENSAGEM DE ERRO //

  setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    this.showSuccess = false;

    setTimeout(() => {
      this.showError = false;
    }, 5000);
  }


  // MENSAGEM DE SUCESSO //

  setSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
    this.showError = false;

    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }


  // ADICIONAR COLABORADOR //

  createEmployee() {
    const request = {
      nome: this.employeeForm.value.nome,
      posicao: this.employeeForm.value.posicao,
      setor: this.employeeForm.value.setor,
      contrato: this.employeeForm.value.contrato,
      centro_custo: this.employeeForm.value.centro_custo,
      vr: this.employeeForm.value.vr,
      vt: this.employeeForm.value.vt,
      vc: this.employeeForm.value.vc,
      vem: this.employeeForm.value.vem
    }

    if (!request.nome || !request.posicao || !request.setor || !request.contrato || !request.centro_custo) {
      this.setErrorMessage('Preencha todos os campos.');
      return;
    }

    this._benefitService.createEmployee(request).subscribe({
      next: () => {
        this.setSuccessMessage('Colaborador criado.');
        this.addEmployee = false;
        this.resetEmployeeForm();
        this.getEmployees();
      },
      error: (error) => {
        console.error(error);
        this.setErrorMessage('Erro ao criar.');
      }
    })
  }

  // RESETAR O FORMULÁRIO APÓS O ENVIO //

  resetEmployeeForm(): void {
    this.employeeForm.reset({
      nome: null,
      posicao: '',
      setor: '',
      contrato: '',
      centro_custo: '',
      vr: null,
      vt: null,
      vc: null,
      vem: null
    });
  }
}

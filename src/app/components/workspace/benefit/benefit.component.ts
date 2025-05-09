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

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private readonly _benefitService = inject(BenefitService);

  // ========== FORMULÁRIOS ========== //
  recordForm: FormGroup = new FormGroup({
    data: new FormControl('')
  })

  createRecordForm: FormGroup = new FormGroup({
    ano_mes: new FormControl(''),
    dias_uteis: new FormControl('')
  })

  createEmployeeForm: FormGroup = new FormGroup({
    nome: new FormControl(''),
    funcao: new FormControl(''),
    setor: new FormControl(''),
    contrato: new FormControl(''),
    centro_custo: new FormControl(''),
    vr_caju: new FormControl(null),
    vr_vr: new FormControl(null),
    vc_caju: new FormControl(null),
    vc_vr: new FormControl(null),
    vt_caju: new FormControl(null),
    vt_vem: new FormControl(null)
  })

  updateEmployeeForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(''),
    funcao: new FormControl(''),
    setor: new FormControl(''),
    contrato: new FormControl(''),
    centro_custo: new FormControl(''),
    vr_caju: new FormControl(null),
    vr_vr: new FormControl(null),
    vc_caju: new FormControl(null),
    vc_vr: new FormControl(null),
    vt_caju: new FormControl(null),
    vt_vem: new FormControl(null)
  })

  // ========== ESTADOS ========== //
  items: any[] = [];
  employees: any[] = [];

  activeButton: string = 'geral';
  geralSection: boolean = true;
  recordSection: boolean = false;
  employeeSection: boolean = false;
  createRecordSection: boolean = false;

  isAlert: boolean = true;
  isFind: boolean = false;
  isCreating: boolean = false;
  isLoading: boolean = false;
  isDeleting: boolean = false;
  isUpdating: boolean = false;

  addEmployee: boolean = false;
  editEmployee: boolean = false;

  showError: boolean = false;
  errorMessage: string = '';

  showSuccess: boolean = false;
  successMessage: string = '';

  // ========== VALORES INICIAS DOS BENEFÍCIOS ========== //
  vr_caju: number = 0;
  vr_vr: number = 0;
  vt_caju: number = 0;
  vt_vem: number = 0;
  vc_caju: number = 0;
  vc_vr: number = 0;
  total_caju: number = 0;
  total_vr: number = 0;
  total_expense: number = 0;

  // ========== HOOK ========== //
  ngOnInit(): void {
    this._titleService.setTitle('Periféricos');
  }

  // ========== API ========== //
  findEmployee(): void {
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

  createEmployee(): void {
    this.isCreating = true;

    const request = {
      nome: this.createEmployeeForm.value.nome,
      funcao: this.createEmployeeForm.value.funcao,
      setor: this.createEmployeeForm.value.setor,
      contrato: this.createEmployeeForm.value.contrato,
      centro_custo: this.createEmployeeForm.value.centro_custo,
      vr_caju: this.createEmployeeForm.value.vr_caju || 0,
      vr_vr: this.createEmployeeForm.value.vr_vr || 0,
      vc_caju: this.createEmployeeForm.value.vc_caju || 0,
      vc_vr: this.createEmployeeForm.value.vc_vr || 0,
      vt_caju: this.createEmployeeForm.value.vt_caju || 0,
      vt_vem: this.createEmployeeForm.value.vt_vem || 0
    }

    if (!request.nome || !request.funcao || !request.setor || !request.contrato || !request.centro_custo) {
      this.setErrorMessage('Preencha todos os campos.');
      this.isCreating = false;
      return;
    }

    this._benefitService.createEmployee(request).subscribe({
      next: () => {
        this.setSuccessMessage('Colaborador criado com sucesso.');
        this.addEmployee = false;
        this.resetForm();
        this.findEmployee();
        this.isCreating = false;
      },
      error: (error) => {
        console.error(error);
        this.setErrorMessage('Erro ao criar.');
        this.isCreating = false;
      }
    })
  }

  updateEmployee(): void {
    this.isUpdating = true;

    const request = {
      id: this.updateEmployeeForm.value.id,
      nome: this.updateEmployeeForm.value.nome,
      funcao: this.updateEmployeeForm.value.funcao,
      setor: this.updateEmployeeForm.value.setor,
      contrato: this.updateEmployeeForm.value.contrato,
      centro_custo: this.updateEmployeeForm.value.centro_custo,
      vr_caju: this.updateEmployeeForm.value.vr_caju || 0,
      vr_vr: this.updateEmployeeForm.value.vr_vr || 0,
      vc_caju: this.updateEmployeeForm.value.vc_caju || 0,
      vc_vr: this.updateEmployeeForm.value.vc_vr || 0,
      vt_caju: this.updateEmployeeForm.value.vt_caju || 0,
      vt_vem: this.updateEmployeeForm.value.vt_vem || 0
    }

    console.log(request)

    if (!request.nome || !request.funcao || !request.setor || !request.contrato || !request.centro_custo) {
      this.setErrorMessage('Preencha todos os campos.');
      this.isUpdating = false;
      return;
    }

    this._benefitService.updateEmployee(request).subscribe({
      next: () => {
        this.setSuccessMessage('Colaborador atualizado com sucesso.');
        this.editEmployee = false;
        this.updateEmployeeForm.reset();
        this.findEmployee();
        this.isUpdating = false;
      },
      error: (error) => {
        console.error(error);
        this.setErrorMessage('Erro ao atualizar.');
        this.isUpdating = false;
      }
    })
  }

  deleteEmployee(): void {
    this.isDeleting = true;

    const id = this.updateEmployeeForm.value.id;

    this._benefitService.deleteEmployee(id).subscribe({
      next: () => {
        this.setSuccessMessage('Colaborador deletado com sucesso.');
        this.editEmployee = false;
        this.updateEmployeeForm.reset();
        this.findEmployee();
        this.isDeleting = false;
      },
      error: (error) => {
        console.error(error);
        this.setErrorMessage('Erro ao deletar.');
        this.isDeleting = false;
      }
    })
  }

  findRecord(): void {
    this.isFind = true;

    const request = {
      data: this.recordForm.value.data
    }

    this._benefitService.findRecord(request).subscribe({
      next: (data) => {
        this.items = data.result;
        this.calculateTotals();
        this.isAlert = this.items.length === 0;
        this.isFind = false;
      },
      error: (error) => {
        this.isAlert = true;
        console.error(error);
        this.setErrorMessage('Erro ao buscar os registros.');
        this.isFind = false;
      }
    })
  }

  createRecord(): void {
    this.isCreating = true;

    const request = {
      ano_mes: this.createRecordForm.value.ano_mes,
      dias_uteis: this.createRecordForm.value.dias_uteis
    }

    if (request.dias_uteis <= 20) {
      this.setErrorMessage('Define uma quantidade válida.');
      return;
    }

    this._benefitService.createRecord(request).subscribe({
      next: () => {
        this.setSuccessMessage('Registro criado com sucesso.');
        this.createRecordForm.reset();
        this.createRecordSection = false;
        this.isCreating = false;
      },
      error: (error) => {
        console.error(error);
        this.setErrorMessage('Erro ao criar registro.');
        this.isCreating = false;
      }
    })
  }

  // ========== ABRIR O FORMULÁRIO COM OS DADOS DO COLABORADOR ========== //
  openEditEmployee(employee: any): void {
    this.editEmployee = true;

    this.updateEmployeeForm.patchValue({
      id: employee.id,
      nome: employee.nome,
      funcao: employee.funcao,
      setor: employee.setor,
      contrato: employee.contrato,
      centro_custo: employee.centro_custo,
      vr_caju: employee.vr_caju,
      vr_vr: employee.vr_vr,
      vc_caju: employee.vc_caju,
      vc_vr: employee.vc_vr,
      vt_caju: employee.vt_caju,
      vt_vem: employee.vt_vem
    });
  }

  // ========== TROCAR ENTRE TELAS ========== //
  showGeral(): void {
    this.geralSection = true;
    this.recordSection = false;
    this.activeButton = 'geral';
    this.employeeSection = false;
  }

  showRecord(): void {
    this.recordSection = true;
    this.geralSection = false;
    this.employeeSection = false;
    this.activeButton = 'record';
  }

  showEmployee(): void {
    this.geralSection = false;
    this.recordSection = false;
    this.employeeSection = true;
    this.activeButton = 'employee';
    this.findEmployee();
  }

  cancelCreateEmployee(): void {
    this.addEmployee = false;
    this.resetForm();
  }

  // ========== MOSTRAR MENSAGENS ========== //
  setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    this.showSuccess = false;

    setTimeout(() => {
      this.showError = false;
    }, 5000);
  }

  setSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
    this.showError = false;

    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  // ========== UTILITÁRIOS ========== //
  calculateTotals() {
    this.vr_caju = 0;
    this.vr_vr = 0;
    this.vt_caju = 0;
    this.vt_vem = 0;
    this.vc_caju = 0;
    this.vc_vr = 0;
    this.total_caju = 0;
    this.total_vr = 0;
    this.total_expense = 0;

    if (this.items && this.items.length > 0) {
      this.items.forEach(item => {
        const dias_uteis = item.dias_uteis;

        const vr_caju = item.vr_caju;
        const vr_vr = item.vr_vr;

        const vc_caju = item.vc_caju;
        const vc_vr = item.vc_vr;

        const vt_caju = item.vt_caju;
        const vt_vem = item.vt_vem;

        this.vr_caju += (vr_caju * dias_uteis);
        this.vr_vr += (vr_vr * dias_uteis);

        this.vt_caju += (vt_caju * dias_uteis);
        this.vt_vem += (vt_vem * dias_uteis);

        this.vc_caju += (vc_caju * dias_uteis);
        this.vc_vr += (vc_vr * dias_uteis)

        this.total_caju = this.vr_caju + this.vt_caju + this.vc_caju;
        this.total_vr = this.vr_vr + this.vc_vr;

        this.total_expense = this.total_caju + this.total_vr;
      });
    }
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  formatedDate(date: Date): string {
    const [year, month] = String(date).split('-');
    return `${month}/${year}`;
  }

  totalMonth(workDays: number, benefit: number): string {
    if (workDays) {
      return (benefit * workDays).toFixed(2);
    } else {
      return '0.00';
    }
  }

  totalExpense(workDays: number, vr: number, vt: number, vc: number): string {
    if (workDays) {
      return (vr * workDays + vt * workDays + vc * workDays).toFixed(2);
    } else {
      return '0.00';
    }
  }

  resetForm(): void {
    this.createEmployeeForm.reset({
      nome: null,
      funcao: '',
      setor: '',
      contrato: '',
      centro_custo: '',
      vr_caju: null,
      vr_vr: null,
      vc_caju: null,
      vc_vr: null,
      vt_caju: null,
      vt_vem: null
    })
  }
}

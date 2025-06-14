import { saveAs } from 'file-saver';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../core/services/title.service';
import { BenefitService } from '../../../core/services/benefit.service';

@Component({
  selector: 'app-benefit',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './benefit.component.html',
  styleUrl: './benefit.component.scss'
})
export class BenefitComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private readonly _benefitService = inject(BenefitService);

  // ========== FORMULÁRIOS ========== //
  recordForm: FormGroup = new FormGroup({
    data: new FormControl(''),
    centro_custo: new FormControl('')
  })

  createRecordForm: FormGroup = new FormGroup({
    ano_mes: new FormControl(''),
    dias_uteis: new FormControl(''),
    dias_nao_uteis: new FormControl(''),
  })

  updateRecordForm: FormGroup = new FormGroup({
    nome: new FormControl(''),
    data: new FormControl(''),
    dias_uteis: new FormControl(''),
    dias_nao_uteis: new FormControl(''),
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
  filteredItem: any[] = [];
  timesheet: any[] = [];

  activeButton: string = 'geral';
  geralSection: boolean = true;
  recordSection: boolean = false;
  employeeSection: boolean = false;
  createRecordSection: boolean = false;
  updateRecordSection: boolean = false;

  isAlert: boolean = true;
  isFind: boolean = false;
  isCreating: boolean = false;
  isLoading: boolean = false;
  isDeleting: boolean = false;
  isUpdating: boolean = false;

  employee: string = '';

  addEmployee: boolean = false;
  editEmployee: boolean = false;

  showError: boolean = false;
  errorMessage: string = '';

  showSuccess: boolean = false;
  successMessage: string = '';

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
        this.filteredItem = [...this.employees];
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
      nome: this.upperCase(this.createEmployeeForm.value.nome),
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
      nome: this.upperCase(this.updateEmployeeForm.value.nome),
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
      data: this.recordForm.value.data,
      centro_custo: this.recordForm.value.centro_custo,
    };

    this._benefitService.findRecord(request).subscribe({
      next: (data: any) => {
        this.items = data.result;
        this.filteredItem = [...this.items];
        this.isAlert = this.items.length === 0;
        this.isFind = false;
      },
      error: (error) => {
        this.isAlert = true;
        console.error(error);
        this.setErrorMessage('Erro ao buscar os registros.');
        this.isFind = false;
      }
    });
  }

  createRecord(): void {
    this.isCreating = true;

    const request = {
      ano_mes: this.createRecordForm.value.ano_mes,
      dias_uteis: this.createRecordForm.value.dias_uteis,
      dias_nao_uteis: this.createRecordForm.value.dias_nao_uteis
    }

    if (request.dias_uteis < 20) {
      this.setErrorMessage('Define uma quantidade válida.');
      return;
    }

    if (request.dias_nao_uteis < 7) {
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

  updateRecord(): void {
    this.isUpdating = true;

    const request = {
      nome: this.removeSpace(this.updateRecordForm.value.nome),
      data: this.updateRecordForm.value.data,
      dias_uteis: this.updateRecordForm.value.dias_uteis,
      dias_nao_uteis: this.updateRecordForm.value.dias_nao_uteis
    }

    if (request.dias_uteis < 0) {
      this.setErrorMessage('Quantidade de dias trabalhados inválida.');
      this.isUpdating = false;
      return;
    }

    if (request.dias_nao_uteis < 0) {
      this.setErrorMessage('Quantidade de dias não trabalhados inválida.');
      this.isUpdating = false;
      return;
    }

    this._benefitService.updateRecord(request).subscribe({
      next: () => {
        this.setSuccessMessage('Registro atualizado com sucesso.');
        this.isUpdating = false;
        this.updateRecordSection = false;
      },
      error: (error) => {
        this.isUpdating = false;
        console.log('Erro ao atualizar colaborador.', error);
        this.isUpdating = false;
      }
    })
  }

  downloadTxt(): void {

    const request = {
      data: '2025-06'
    }

    this._benefitService.getTxt(request).subscribe((blob: Blob) => {
      saveAs(blob, 'layoutVR.txt');
    });
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

  openEditRecord(employee: any): void {
    this.updateRecordSection = true;

    this.updateRecordForm.patchValue({
      nome: employee.nome,
      data: employee.data,
      dias_uteis: employee.dias_uteis,
      dias_nao_uteis: employee.dias_nao_uteis,
    });
  }

  // ========== BUSCAR COLABORADOR ========== //
  applyFilters() {
    let data = [...this.filteredItem];

    if (this.employee) {
      const inputValue = this.employee.toUpperCase();
      data = data.filter(data =>
        data.nome.toUpperCase().includes(inputValue)
      );
    }

    this.employees = data;
    this.items = data;
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

  // ========== GRÁFICO ========== //
  vrCajuIndicator(): number {
    const total = this.items.reduce((count: number, value: any) => {
      return count + value.vr_caju_month;
    }, 0)

    return parseFloat(total.toFixed(2));
  }

  vrVrIndicator() {
    const total = this.items.reduce((count: number, value: any) => {
      return count + value.vr_vr_month;
    }, 0)

    return parseFloat(total.toFixed(2));
  }

  vtCajuIndicator(): number {
    const total = this.items.reduce((count: number, value: any) => {
      return count + value.vt_caju_month;
    }, 0)

    return parseFloat(total.toFixed(2));
  }

  vtVemIndicator(): number {
    const total = this.items.reduce((count: number, value: any) => {
      return count + value.vt_vem_month;
    }, 0)

    return parseFloat(total.toFixed(2));
  }

  totalCaju(): number {
    const total = this.items.reduce((count: number, value: any) => {
      return count + value.vr_caju_month + value.vt_caju_month + value.vc_caju_month;
    }, 0)

    return parseFloat(total.toFixed(2));
  }

  totalVr(): number {
    const total = this.items.reduce((count: number, value: any) => {
      return count + value.vr_vr_month + value.vc_vr_month;
    }, 0)

    return parseFloat(total.toFixed(2));
  }

  total(): number {
    return parseFloat((this.totalCaju() + this.totalVr() + this.vtVemIndicator()).toFixed(2));
  }

  totalEmployees(): number {
    return this.items.length
  }

  mediaVR(): number {
    if (this.totalEmployees() <= 0) return 0;
    return (this.vrCajuIndicator() + this.vrVrIndicator()) / this.totalEmployees();
  }

  mediaVT(): number {
    if (this.totalEmployees() <= 0) return 0;
    const vr = this.vtCajuIndicator() + this.vtVemIndicator();
    const vc = this.vcCajuIndicator() + this.vcVrIndicator();
    return (vr + vc) / this.totalEmployees();
  }

  mediaGeral(): number {
    if (this.totalEmployees() <= 0) return 0;
    return this.total() / this.totalEmployees();
  }

  vcCajuIndicator(): number {
    const total = this.items.reduce((count: number, value: any) => {
      return count + value.vc_caju_month;
    }, 0)

    return parseFloat(total.toFixed(2));
  }

  vcVrIndicator(): number {
    const total = this.items.reduce((count: number, value: any) => {
      return count + value.vc_vr_month;
    }, 0)

    return parseFloat(total.toFixed(2));
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // ========== UTILITÁRIOS ========== //
  upperCase(string: string): string {
    return string.toUpperCase().trim();
  }

  removeSpace(value: string): string {
    return value.trim();
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
    });
  }
}

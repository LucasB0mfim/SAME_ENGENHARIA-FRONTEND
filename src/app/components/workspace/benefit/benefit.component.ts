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
    data: new FormControl('')
  })

  createRecordForm: FormGroup = new FormGroup({
    ano_mes: new FormControl(''),
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
      data: this.recordForm.value.data
    };

    this._benefitService.findRecord(request).subscribe({
      next: (data: any) => {
        this.items = data.result.map((item: any) => {
          const dias_extras = item.timesheet.filter(
            (ts: any) => ts.evento_abono === 'Dia extra'
          ).length;

          const faltas = item.timesheet.filter(
            (ts: any) =>
              ts.falta === 'SIM' &&
              ts.evento_abono === 'NÃO CONSTA' &&
              (ts.jornada_realizada
                ? Number(ts.jornada_realizada.split(':')[0]) <= 3
                : false)
          ).length;

          const atestados = item.timesheet.filter(
            (ts: any) => ts.evento_abono === 'Atestado Médico'
          ).length;

          return {
            ...item,
            dias_extras,
            faltas,
            atestados
          };
        });

        this.calculateTotals();
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

  // ========== UTILITÁRIOS ========== //
  private getWorkedDays(workingDays: number, extraDays: number, absences: number): number {
    const workedDays = workingDays + extraDays - absences;
    return workedDays >= 0 ? workedDays : 0;
  }

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

    if (!this.items || this.items.length === 0) return;

    this.items.forEach(item => {
      const workedDays = this.getWorkedDays(item.dias_uteis, item.dias_extras, item.faltas);
      const { vr_caju, vr_vr, vc_caju, vc_vr, vt_caju, vt_vem } = item;

      // Vale Refeição (CAJU)
      if (vr_caju > 50) this.vr_caju += vr_caju;
      else this.vr_caju += vr_caju * workedDays;

      // Vale Refeição (VR)
      if (vr_vr > 50) this.vr_vr += vr_vr;
      else this.vr_vr += vr_vr * workedDays;

      // Vale Combustível (CAJU)
      if (vc_caju > 50) this.vc_caju += vc_caju;
      else this.vc_caju += vc_caju * workedDays;

      // Vale Combustível (VR)
      if (vc_vr > 50) this.vc_vr += vc_vr;
      else this.vc_vr += vc_vr * workedDays;

      // Vale Transporte (CAJU)
      if (vt_caju > 50) this.vt_caju += vt_caju;
      else this.vt_caju += vt_caju * workedDays;

      // Vale Transporte (VEM)
      if (vt_vem > 50) this.vt_vem += vt_vem;
      else this.vt_vem += vt_vem * workedDays;
    });

    this.total_caju = this.vr_caju + this.vt_caju + this.vc_caju;
    this.total_vr = this.vr_vr + this.vc_vr;
    this.total_expense = this.total_caju + this.total_vr + this.vt_vem;
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

  calculateDay(workingDays: number, extraDays: number, absences: number, card1: number, card2: number): string {
    const addCards = card1 + card2;
    return `R$ ${addCards.toFixed(2)}`;
  }

  calculateMonthly(workingDays: number, extraDays: number, absences: number, card1: number, card2: number): string {
    const workedDays = this.getWorkedDays(workingDays, extraDays, absences);
    const addCards = card1 + card2;

    let vr_month = 0;
    if (card1 > 50 || card2 > 50) {
      vr_month = addCards; // Valor fixo mensal
    } else {
      vr_month = addCards * workedDays; // Proporcional aos dias trabalhados
    }

    return `R$ ${vr_month.toFixed(2)}`;
  }

  totalExpense(
    workingDays: number,
    extraDays: number,
    absences: number,
    vr_caju: number,
    vr_vr: number,
    vt_caju: number,
    vt_vem: number,
    vc_caju: number,
    vc_vr: number
  ): string {
    const workedDays = this.getWorkedDays(workingDays, extraDays, absences);

    // Vale Refeição
    const vr = vr_caju + vr_vr;
    let monthVr = vr > 50 ? vr : vr * workedDays;

    // Vale Transporte
    const vt = vt_caju + vt_vem;
    let monthVt = vt > 50 ? vt : vt * workedDays;

    // Vale Combustível
    const vc = vc_caju + vc_vr;
    let monthVc = vc > 50 ? vc : vc * workedDays;

    return `R$ ${(monthVr + monthVt + monthVc).toFixed(2)}`;
  }

  upperCase(string: string): string {
    return string.toUpperCase().trim();
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

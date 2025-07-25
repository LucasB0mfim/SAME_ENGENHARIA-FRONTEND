import { saveAs } from 'file-saver';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../core/services/title.service';
import { BenefitService } from '../../../core/services/benefit.service';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-benefit',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatProgressSpinnerModule, NgxMaskDirective],
  providers: [provideNgxMask()],
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
    id: new FormControl(''),
    nome: new FormControl(''),
    data: new FormControl(''),
    reembolso: new FormControl(''),
    dias_uteis: new FormControl(''),
    dias_nao_uteis: new FormControl(''),
    funcao: new FormControl(''),
    setor: new FormControl(''),
    contrato: new FormControl(''),
    centro_custo: new FormControl(''),
    recebe_integral: new FormControl(''),
    vr_caju: new FormControl(null),
    vr_vr: new FormControl(null),
    vc_caju: new FormControl(null),
    vc_vr: new FormControl(null),
    vt_caju: new FormControl(null),
    vt_vem: new FormControl(null),
    vr_caju_fixo: new FormControl(''),
    vr_vr_fixo: new FormControl(''),
    vc_caju_fixo: new FormControl(''),
    vc_vr_fixo: new FormControl(''),
    vt_caju_fixo: new FormControl(''),
    vt_vem_fixo: new FormControl('')
  })

  deleteMonthForm: FormGroup = new FormGroup({
    data: new FormControl(''),
  })

  createLayoutVrForm: FormGroup = new FormGroup({
    data: new FormControl(''),
    beneficioVr: new FormControl(''),
    centro_custo: new FormControl('')
  })

  createLayoutCajuForm: FormGroup = new FormGroup({
    data: new FormControl(''),
    beneficioCaju: new FormControl(''),
    centro_custo: new FormControl('')
  })

  createLayoutVemForm: FormGroup = new FormGroup({
    data: new FormControl(''),
    centro_custo: new FormControl('')
  })

  createEmployeeForm: FormGroup = new FormGroup({
    nome: new FormControl(''),
    chapa: new FormControl(''),
    cpf: new FormControl(null),
    data_nascimento: new FormControl(''),
    funcao: new FormControl(''),
    setor: new FormControl(''),
    contrato: new FormControl(''),
    centro_custo: new FormControl(''),
    recebe_integral: new FormControl(''),
    vr_caju: new FormControl(null),
    vr_vr: new FormControl(null),
    vc_caju: new FormControl(null),
    vc_vr: new FormControl(null),
    vt_caju: new FormControl(null),
    vt_vem: new FormControl(null),
    vr_caju_fixo: new FormControl(''),
    vr_vr_fixo: new FormControl(''),
    vc_caju_fixo: new FormControl(''),
    vc_vr_fixo: new FormControl(''),
    vt_caju_fixo: new FormControl(''),
    vt_vem_fixo: new FormControl('')
  })

  updateEmployeeForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(''),
    chapa: new FormControl(''),
    cpf: new FormControl(null),
    data_nascimento: new FormControl(''),
    funcao: new FormControl(''),
    setor: new FormControl(''),
    contrato: new FormControl(''),
    centro_custo: new FormControl(''),
    recebe_integral: new FormControl(''),
    vr_caju: new FormControl(null),
    vr_vr: new FormControl(null),
    vc_caju: new FormControl(null),
    vc_vr: new FormControl(null),
    vt_caju: new FormControl(null),
    vt_vem: new FormControl(null),
    vr_caju_fixo: new FormControl(''),
    vr_vr_fixo: new FormControl(''),
    vc_caju_fixo: new FormControl(''),
    vc_vr_fixo: new FormControl(''),
    vt_caju_fixo: new FormControl(''),
    vt_vem_fixo: new FormControl('')
  })

  // ========== ESTADOS ========== //
  items: any[] = [];
  employees: any[] = [];
  filteredItem: any[] = [];
  timesheet: any[] = [];
  grafic: any = {};

  activeButton: string = 'geral';
  geralSection: boolean = true;
  recordSection: boolean = false;
  deleteMonthSection: boolean = false;
  employeeSection: boolean = false;
  createRecordSection: boolean = false;
  settingSection: boolean = false;
  layoutVrSection: boolean = false;
  layoutCajuSection: boolean = false;
  layoutVemSection: boolean = false;
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

  userEmail = localStorage.getItem('email');

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
      chapa: this.createEmployeeForm.value.chapa || '000000',
      cpf: this.createEmployeeForm.value.cpf,
      data_nascimento: this.createEmployeeForm.value.data_nascimento,
      funcao: this.createEmployeeForm.value.funcao,
      setor: this.createEmployeeForm.value.setor,
      contrato: this.createEmployeeForm.value.contrato,
      centro_custo: this.createEmployeeForm.value.centro_custo,
      recebe_integral: this.createEmployeeForm.value.recebe_integral || 'NÃO',
      vr_caju: this.createEmployeeForm.value.vr_caju || 0,
      vr_vr: this.createEmployeeForm.value.vr_vr || 0,
      vc_caju: this.createEmployeeForm.value.vc_caju || 0,
      vc_vr: this.createEmployeeForm.value.vc_vr || 0,
      vt_caju: this.createEmployeeForm.value.vt_caju || 0,
      vt_vem: this.createEmployeeForm.value.vt_vem || 0,
      vr_caju_fixo: this.createEmployeeForm.value.vr_caju_fixo || 'NÃO',
      vr_vr_fixo: this.createEmployeeForm.value.vr_vr_fixo || 'NÃO',
      vc_caju_fixo: this.createEmployeeForm.value.vc_caju_fixo || 'NÃO',
      vc_vr_fixo: this.createEmployeeForm.value.vc_vr_fixo || 'NÃO',
      vt_caju_fixo: this.createEmployeeForm.value.vt_caju_fixo || 'NÃO',
      vt_vem_fixo: this.createEmployeeForm.value.vt_vem_fixo || 'NÃO'
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
      chapa: this.updateEmployeeForm.value.chapa,
      cpf: this.updateEmployeeForm.value.cpf,
      data_nascimento: this.updateEmployeeForm.value.data_nascimento,
      funcao: this.updateEmployeeForm.value.funcao,
      setor: this.updateEmployeeForm.value.setor,
      contrato: this.updateEmployeeForm.value.contrato,
      centro_custo: this.updateEmployeeForm.value.centro_custo,
      recebe_integral: this.updateEmployeeForm.value.recebe_integral || 'NÃO',
      vr_caju: this.updateEmployeeForm.value.vr_caju || 0,
      vr_vr: this.updateEmployeeForm.value.vr_vr || 0,
      vc_caju: this.updateEmployeeForm.value.vc_caju || 0,
      vc_vr: this.updateEmployeeForm.value.vc_vr || 0,
      vt_caju: this.updateEmployeeForm.value.vt_caju || 0,
      vt_vem: this.updateEmployeeForm.value.vt_vem || 0,
      vr_caju_fixo: this.updateEmployeeForm.value.vr_caju_fixo || 'NÃO',
      vr_vr_fixo: this.updateEmployeeForm.value.vr_vr_fixo || 'NÃO',
      vc_caju_fixo: this.updateEmployeeForm.value.vc_caju_fixo || 'NÃO',
      vc_vr_fixo: this.updateEmployeeForm.value.vc_vr_fixo || 'NÃO',
      vt_caju_fixo: this.updateEmployeeForm.value.vt_caju_fixo || 'NÃO',
      vt_vem_fixo: this.updateEmployeeForm.value.vt_vem_fixo || 'NÃO'
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

    this._benefitService.getBenefitMedia(request).subscribe({
      next: (data) => {
        const response = data.result;

        this.grafic = {
          employees: response.employees,
          vr_caju: response.vr_caju,
          vr_vr: response.vr_vr,
          vc_caju: response.vc_caju,
          vc_vr: response.vc_vr,
          vt_caju: response.vt_caju,
          vt_vem: response.vt_vem,
          sum_vr: response.sum_vr,
          sum_vc: response.sum_vc,
          sum_vt: response.sum_vt,
          total_caju: response.total_caju,
          total_vr: response.total_vr,
          sum_cards: response.sum_cards,
          sum_all: response.sum_all,
          media_all: response.media_all,
          media_vr: response.media_vr,
          media_vt: response.media_vt
        }
      },
      error: (error) => {
        console.error(error)
      }
    })
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
      id: this.updateRecordForm.value.id,
      data: this.updateRecordForm.value.data,
      nome: this.removeSpace(this.updateRecordForm.value.nome),
      reembolso: this.updateRecordForm.value.reembolso,
      dias_uteis: this.updateRecordForm.value.dias_uteis,
      dias_nao_uteis: this.updateRecordForm.value.dias_nao_uteis,
      funcao: this.updateRecordForm.value.funcao,
      setor: this.updateRecordForm.value.setor,
      contrato: this.updateRecordForm.value.contrato,
      centro_custo: this.updateRecordForm.value.centro_custo,
      recebe_integral: this.updateRecordForm.value.recebe_integral,
      vr_caju: this.updateRecordForm.value.vr_caju,
      vr_caju_fixo: this.updateRecordForm.value.vr_caju_fixo,
      vr_vr: this.updateRecordForm.value.vr_vr,
      vr_vr_fixo: this.updateRecordForm.value.vr_vr_fixo,
      vc_caju: this.updateRecordForm.value.vc_caju,
      vc_caju_fixo: this.updateRecordForm.value.vc_caju_fixo,
      vc_vr: this.updateRecordForm.value.vc_vr,
      vc_vr_fixo: this.updateRecordForm.value.vc_vr_fixo,
      vt_caju: this.updateRecordForm.value.vt_caju,
      vt_caju_fixo: this.updateRecordForm.value.vt_caju_fixo,
      vt_vem: this.updateRecordForm.value.vt_vem,
      vt_vem_fixo: this.updateRecordForm.value.vt_vem_fixo,
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

  deleteRecord(): void {
    this.isDeleting = true;

    const id = this.updateRecordForm.value.id;

    this._benefitService.deleteRecord(id).subscribe({
      next: () => {
        this.setSuccessMessage('Colaborador deletado com sucesso.');
        this.isDeleting = false;
        this.updateRecordSection = false;
        this.items = this.items.filter((item) => item.id !== id);
      },
      error: (error) => {
        console.error(error);
        this.setErrorMessage('Erro ao deletar.');
        this.isDeleting = false;
      }
    })
  }

  deleteMonth(): void {
    this.isCreating = true;

    const month = this.deleteMonthForm.value.data

    if (!month) {
      this.setErrorMessage('Define uma data válida.');
      return;
    }

    this._benefitService.deleteMonth(month).subscribe({
      next: () => {
        this.setSuccessMessage('Mês deletado com sucesso.');
        this.deleteMonthForm.reset();
        this.deleteMonthSection = false;
        this.isCreating = false;
      },
      error: (error) => {
        console.error(error);
        this.setErrorMessage('Erro ao deletar mês.');
        this.isCreating = false;
      }
    })
  }

  downloadLayoutVr(): void {
    this.isCreating = true;

    const request = {
      data: this.createLayoutVrForm.value.data,
      benefit: this.createLayoutVrForm.value.beneficioVr,
      centro_custo: this.createLayoutVrForm.value.centro_custo
    };

    this._benefitService.donwloadLayoutVr(request).subscribe({
      next: (blob: Blob) => {
        this.isCreating = false;
        saveAs(blob, 'layoutVR.txt');
        this.resetLayoutVrForm();
      },
      error: (error) => {
        console.error(error);
        this.isCreating = false;
      }
    });
  }

  downloadLayoutCaju(): void {
    this.isCreating = true;

    const request = {
      data: this.createLayoutCajuForm.value.data,
      benefit: this.createLayoutCajuForm.value.beneficioCaju,
      centro_custo: this.createLayoutCajuForm.value.centro_custo
    };

    this._benefitService.donwloadLayoutCaju(request).subscribe({
      next: (blob: Blob) => {
        this.isCreating = false;
        saveAs(blob, 'layoutCaju.txt');
        this.resetLayoutCajuForm();
      },
      error: (error) => {
        console.error(error);
        this.isCreating = false;
      }
    });
  }

  downloadLayoutVem(): void {
    this.isCreating = true;

    const request = {
      data: this.createLayoutVemForm.value.data,
      centro_custo: this.createLayoutVemForm.value.centro_custo
    };

    this._benefitService.donwloadLayoutVem(request).subscribe({
      next: (blob: Blob) => {
        this.isCreating = false;
        saveAs(blob, 'layoutVem.txt');
        this.resetLayoutVrForm();
      },
      error: (error) => {
        console.error(error);
        this.isCreating = false;
      }
    });
  }

  // ========== ABRIR O FORMULÁRIO COM OS DADOS DO COLABORADOR ========== //
  openEditEmployee(employee: any): void {
    this.editEmployee = true;

    this.updateEmployeeForm.patchValue({
      id: employee.id,
      nome: employee.nome,
      chapa: employee.chapa,
      cpf: employee.cpf,
      data_nascimento: this.formateDate(employee.data_nascimento),
      funcao: employee.funcao,
      setor: employee.setor,
      contrato: employee.contrato,
      centro_custo: employee.centro_custo,
      recebe_integral: employee.recebe_integral,
      vr_caju: employee.vr_caju,
      vr_vr: employee.vr_vr,
      vc_caju: employee.vc_caju,
      vc_vr: employee.vc_vr,
      vt_caju: employee.vt_caju,
      vt_vem: employee.vt_vem,
      vr_caju_fixo: employee.vr_caju_fixo,
      vr_vr_fixo: employee.vr_vr_fixo,
      vc_caju_fixo: employee.vc_caju_fixo,
      vc_vr_fixo: employee.vc_vr_fixo,
      vt_caju_fixo: employee.vt_caju_fixo,
      vt_vem_fixo: employee.vt_vem_fixo
    });
  }

  openEditRecord(employee: any): void {
    this.updateRecordSection = true;

    this.updateRecordForm.patchValue({
      id: employee.id,
      nome: employee.nome,
      data: employee.data,
      reembolso: employee.reembolso,
      dias_uteis: employee.dias_uteis,
      dias_nao_uteis: employee.dias_nao_uteis,
      funcao: employee.funcao,
      setor: employee.setor,
      contrato: employee.contrato,
      centro_custo: employee.centro_custo,
      recebe_integral: employee.recebe_integral,
      vr_caju: employee.vr_caju,
      vr_vr: employee.vr_vr,
      vc_caju: employee.vc_caju,
      vc_vr: employee.vc_vr,
      vt_caju: employee.vt_caju,
      vt_vem: employee.vt_vem,
      vr_caju_fixo: employee.vr_caju_fixo,
      vr_vr_fixo: employee.vr_vr_fixo,
      vc_caju_fixo: employee.vc_caju_fixo,
      vc_vr_fixo: employee.vc_vr_fixo,
      vt_caju_fixo: employee.vt_caju_fixo,
      vt_vem_fixo: employee.vt_vem_fixo
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
    this.employee = '';
  }

  showRecord(): void {
    this.recordSection = true;
    this.geralSection = false;
    this.employeeSection = false;
    this.activeButton = 'record';
    this.employee = '';
  }

  showEmployee(): void {
    this.geralSection = false;
    this.recordSection = false;
    this.employeeSection = true;
    this.activeButton = 'employee';
    this.employee = '';
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
  formatCurrency(value: number): string {
    if (!value) {
      return '0,00'
    } else {
      return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  }

  // ========== UTILITÁRIOS ========== //
  upperCase(string: string): string {
    return string.toUpperCase().trim();
  }

  removeSpace(value: string): string {
    return value.trim();
  }

  formateDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}${month}${year}`;
  }

  resetForm(): void {
    this.createEmployeeForm.reset({
      nome: '',
      chapa: '',
      funcao: '',
      setor: '',
      contrato: '',
      centro_custo: '',
      recebe_integral: '',
      vr_caju: null,
      vr_vr: null,
      vc_caju: null,
      vc_vr: null,
      vt_caju: null,
      vt_vem: null,
      vr_caju_fixo: '',
      vr_vr_fixo: '',
      vc_caju_fixo: '',
      vc_vr_fixo: '',
      vt_caju_fixo: '',
      vt_vem_fixo: ''
    });
  }

  resetLayoutVrForm(): void {
    this.createLayoutVrForm.reset({
      data: null,
      beneficioVr: '',
      centro_custo: ''
    });
  }

  resetLayoutCajuForm(): void {
    this.createLayoutCajuForm.reset({
      data: null,
      beneficioCaju: '',
      centro_custo: ''
    });
  }
}

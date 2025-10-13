import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TitleService } from '../../../../core/services/title.service';
import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
  selector: 'app-employee',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatProgressSpinnerModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private readonly _employeeService = inject(EmployeeService);

  // ========== FORMULÁRIOS ========== //
  costCenterForm: FormGroup = new FormGroup({
    centroCusto: new FormControl('GERAL')
  })

  createForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl(''),
    chapa: new FormControl(''),
    cpf: new FormControl(''),
    dataNascimento: new FormControl(''),
    funcao: new FormControl(''),
    setor: new FormControl(''),
    contrato: new FormControl(''),
    centroCusto: new FormControl(''),
    recebeIntegral: new FormControl(''),
    vrCaju: new FormControl(null),
    vrCajuFixo: new FormControl(''),
    vcCaju: new FormControl(null),
    vcCajuFixo: new FormControl(''),
    vtCaju: new FormControl(null),
    vtCajuFixo: new FormControl(''),
    vrVr: new FormControl(null),
    vrVrFixo: new FormControl(''),
    vcVr: new FormControl(null),
    vcVrFixo: new FormControl(''),
    vtVem: new FormControl(null),
    vtVemFixo: new FormControl('')
  });

  updateForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl(''),
    chapa: new FormControl(''),
    cpf: new FormControl(''),
    dataNascimento: new FormControl(''),
    funcao: new FormControl(''),
    setor: new FormControl(''),
    contrato: new FormControl(''),
    centroCusto: new FormControl(''),
    recebeIntegral: new FormControl(''),
    vrCaju: new FormControl(null),
    vrCajuFixo: new FormControl(''),
    vcCaju: new FormControl(null),
    vcCajuFixo: new FormControl(''),
    vtCaju: new FormControl(null),
    vtCajuFixo: new FormControl(''),
    vrVr: new FormControl(null),
    vrVrFixo: new FormControl(''),
    vcVr: new FormControl(null),
    vcVrFixo: new FormControl(''),
    vtVem: new FormControl(null),
    vtVemFixo: new FormControl('')
  });

  deleteForm: FormGroup = new FormGroup({
    id: new FormControl('')
  });

  // ========== ESTADOS ========== //
  items: any[] = [];
  filteredItems: any[] = [];
  employeeInfo: any[] = [];

  functionUnique: String[] = [];
  costCenterUnique: String[] = [];

  employee: string = '';

  create: boolean = false;
  isCreating: boolean = false;

  update: boolean = false;
  isUpdating: boolean = false;

  delete: boolean = false;
  isDeleting: boolean = false;

  isFind: boolean = false;
  isLoading: boolean = true;

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  // ========== HOOK ========== //
  ngOnInit(): void {
    this.getEmployee();
    this._titleService.setTitle('Efetivo');
  }

  // ========== API ========== //
  getEmployee(): void {
    this.isLoading = true;

    this._employeeService.findEmployees().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.items = data.result;
        this.filteredItems = [...this.items];
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      }
    })
  }

  // ========== TROCAR ENTRE TELAS ========== //
  openModalCreate(): void {
    this.create = true;
  }

  openModalEdit(item: any): void {
    this.update = true;

    this.updateForm.patchValue({
      id: item.id,
      nome: item.nome,
      chapa: item.chapa,
      cpf: item.cpf,
      dataNascimento: item.data_nascimento,
      funcao: item.funcao,
      setor: item.setor,
      contrato: item.contrato,
      centroCusto: item.centro_custo,
      recebeIntegral: item.recebe_integral,
      vrCaju: item.vr_caju,
      vrCajuFixo: item.vr_caju_fixo,
      vcCaju: item.vc_caju,
      vcCajuFixo: item.vc_caju_fixo,
      vtCaju: item.vt_caju,
      vtCajuFixo: item.vt_caju_fixo,
      vrVr: item.vr_vr,
      vrVrFixo: item.vr_vr_fixo,
      vcVr: item.vc_vr,
      vcVrFixo: item.vc_vr_fixo,
      vtVem: item.vt_vem,
      vtVemFixo: item.vt_vem_fixo
    });

    this.deleteForm.patchValue({
      id: item.id
    });
  }

  openModalDelete(): void {
    this.delete = true;
    this.update = false;
  }

  closeModal(): void {
    this.create = false;
    this.update = false;
    this.delete = false;
  }

  // ========== BUSCAR COLABORADOR ========== //
  applyFilters() {
    let data = [...this.filteredItems];

    if (this.employee) {
      const inputValue = this.employee.toUpperCase();
      data = data.filter(data =>
        data.nome.toUpperCase().includes(inputValue)
      );
    }

    this.items = data;
  }

  // ========== MENSAGEM DINAMICA ========== //
  setMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  }
}

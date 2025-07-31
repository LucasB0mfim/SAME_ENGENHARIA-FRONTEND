import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { BenefitService } from '../../../core/services/benefit.service';

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
  private readonly _benefitService = inject(BenefitService);

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

    this._benefitService.findAll().subscribe({
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

  getByCostCenter(): void {
    this.items = [];
    this.isFind = true;
    this.isLoading = true;

    const request = { centro_custo: this.costCenterForm.value.centroCusto || 'GERAL' }

    this._benefitService.findByCostCenter(request).subscribe({
      next: (res) => {
        this.items = res.result;
        this.filteredItems = [...this.items];
        this.isFind = false;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao consultar centros de custo!', error);
        this.isFind = false;
        this.isLoading = false;
      }
    });
  }

  createEmployee(): void {
    this.isCreating = true;

    const request = {
      nome: this.createForm.value.nome,
      chapa: this.createForm.value.chapa,
      cpf: this.createForm.value.cpf,
      data_nascimento: this.createForm.value.dataNascimento,
      funcao: this.createForm.value.funcao,
      setor: this.createForm.value.setor,
      contrato: this.createForm.value.contrato,
      centro_custo: this.createForm.value.centroCusto,
      recebe_integral: this.createForm.value.recebeIntegral,
      vr_caju: this.createForm.value.vrCaju,
      vr_caju_fixo: this.createForm.value.vrCajuFixo,
      vc_caju: this.createForm.value.vcCaju,
      vc_caju_fixo: this.createForm.value.vcCajuFixo,
      vt_caju: this.createForm.value.vtCaju,
      vt_caju_fixo: this.createForm.value.vtCajuFixo,
      vr_vr: this.createForm.value.vrVr,
      vr_vr_fixo: this.createForm.value.vrVrFixo,
      vc_vr: this.createForm.value.vcVr,
      vc_vr_fixo: this.createForm.value.vcVrFixo,
      vt_vem: this.createForm.value.vtVem,
      vt_vem_fixo: this.createForm.value.vtVemFixo,
    }

    this._benefitService.createEmployee(request).subscribe({
      next: () => {
        this.isCreating = false;
        this.create = false;
        this.createForm.reset({
          nome: '',
          chapa: '',
          cpf: '',
          dataNascimento: '',
          funcao: '',
          setor: '',
          contrato: '',
          centroCusto: '',
          recebeIntegral: '',
          vrCaju: null,
          vrCajuFixo: '',
          vcCaju: null,
          vcCajuFixo: '',
          vtCaju: null,
          vtCajuFixo: '',
          vrVr: null,
          vrVrFixo: '',
          vcVr: null,
          vcVrFixo: '',
          vtVem: null,
          vtVemFixo: ''
        })
        this.employee = '';
        this.getEmployee();
        this.setMessage('Colaborador criado com sucesso!', 'success');
      },
      error: (error) => {
        this.isCreating = false;
        console.error('Falha ao criar colaborador: ', error);
        this.setMessage('Falha ao criar o colaborador! Confira os dados informados.', 'error');
      }
    });
  }

  updateEmployee(): void {
    this.isUpdating = true;

    const request = {
      id: this.updateForm.value.id,
      nome: this.updateForm.value.nome,
      chapa: this.updateForm.value.chapa,
      cpf: this.updateForm.value.cpf,
      data_nascimento: this.updateForm.value.dataNascimento,
      funcao: this.updateForm.value.funcao,
      setor: this.updateForm.value.setor,
      contrato: this.updateForm.value.contrato,
      centro_custo: this.updateForm.value.centroCusto,
      recebe_integral: this.updateForm.value.recebeIntegral,
      vr_caju: this.updateForm.value.vrCaju,
      vr_caju_fixo: this.updateForm.value.vrCajuFixo,
      vc_caju: this.updateForm.value.vcCaju,
      vc_caju_fixo: this.updateForm.value.vcCajuFixo,
      vt_caju: this.updateForm.value.vtCaju,
      vt_caju_fixo: this.updateForm.value.vtCajuFixo,
      vr_vr: this.updateForm.value.vrVr,
      vr_vr_fixo: this.updateForm.value.vrVrFixo,
      vc_vr: this.updateForm.value.vcVr,
      vc_vr_fixo: this.updateForm.value.vcVrFixo,
      vt_vem: this.updateForm.value.vtVem,
      vt_vem_fixo: this.updateForm.value.vtVemFixo,
    }

    this._benefitService.updateEmployee(request).subscribe({
      next: () => {
        this.update = false;
        this.isUpdating = false;
        this.employee = '';
        this.getEmployee();
        this.setMessage('Colaborador atualizado com sucesso!', 'success');
      },
      error: (error) => {
        this.update = false;
        this.isUpdating = false;
        console.error('Erro ao atualizar colaborador: ', error);
        this.setMessage('Não foi possível atualizar colaborador!', 'error');
      }
    });
  }

  deleteEmployee(): void {
    this.isDeleting = true;
    const id = this.deleteForm.value.id;

    this._benefitService.deleteEmployee(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.delete = false;
        this.employee = '';
        this.getEmployee();
        this.setMessage('Colaborador deletado com sucesso!', 'success');
      },
      error: (error) => {
        this.isDeleting = false;
        console.error('Falha ao deletar colaborador: ', error);
        this.setMessage('Não foi possível deletar colaborador!', 'error');
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

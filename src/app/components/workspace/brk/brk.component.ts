import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BrkService } from '../../../core/services/brk.service';
import { TitleService } from '../../../core/services/title.service';
import { BenefitService } from '../../../core/services/benefit.service';

@Component({
  selector: 'app-brk',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './brk.component.html',
  styleUrl: './brk.component.scss'
})
export class BrkComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private readonly _brkService = inject(BrkService);

  // ========== FORMULÁRIOS ========== //
  costCenterForm: FormGroup = new FormGroup({
    centroCusto: new FormControl('GERAL')
  })

  createForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl(''),
    funcao: new FormControl(''),
    protocolo: new FormControl(''),
    contrato: new FormControl(''),
    centroCusto: new FormControl(''),
    status: new FormControl(''),
    pesquisaSocial: new FormControl(''),
    prevAprovPesqSocial: new FormControl(''),
    treinamento: new FormControl(''),
    fichaEPI: new FormControl(''),
    envioDoc: new FormControl(''),
    prevAprovDoc: new FormControl(''),
    os: new FormControl(''),
    aso: new FormControl(''),
    reenvioDoc: new FormControl(''),
    prevAprovReenvioDoc: new FormControl('')
  })

  updateForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl(''),
    funcao: new FormControl(''),
    protocolo: new FormControl(''),
    contrato: new FormControl(''),
    centroCusto: new FormControl(''),
    status: new FormControl(''),
    pesquisaSocial: new FormControl(''),
    prevAprovPesqSocial: new FormControl(''),
    treinamento: new FormControl(''),
    fichaEPI: new FormControl(''),
    envioDoc: new FormControl(''),
    prevAprovDoc: new FormControl(''),
    os: new FormControl(''),
    aso: new FormControl(''),
    reenvioDoc: new FormControl(''),
    prevAprovReenvioDoc: new FormControl('')
  })

  // ========== ESTADOS ========== //
  items: any[] = [];
  filteredItems: any[] = [];
  currentItem: any[] = [];

  employee: string = '';

  isModalCreate: boolean = false;
  isModalEdit: boolean = false;

  isLoading: boolean = true;
  isEmpty: boolean = false;

  isCreate: boolean = false;
  isUpdate: boolean = false;

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  status: string = '';
  newCountCount: number = 0;
  progressCount: number = 0;
  releasedCount: number = 0;
  canceledCount: number = 0;

  // ========== HOOK ========== //
  ngOnInit(): void {
    this.findByStatus('NOVO');
    this._titleService.setTitle('BRK');
  }

  // ========== API ========== //
  findByStatus(status: string): void {
    this.items = [];
    this.isEmpty = false;
    this.isLoading = true;
    this.status = status;

    const request = { status }

    this._brkService.findByStatus(request).subscribe({
      next: (res) => {
        this.items = res.result;
        this.filteredItems = [...this.items];
        this.isLoading = false;
        this.isEmpty = this.items.length === 0;
      },
      error: (error) => {
        this.items = [];
        this.isLoading = false;
        this.isEmpty = true;
        console.error('Erro ao consultar dados: ', error);
        this.setMessage('Não foi possível carregar os dados!', 'error');
      }
    });
  }

  findByAll(status: string): void {
    this.items = [];
    this.isEmpty = false;
    this.isLoading = true;
    this.status = status;

    this._brkService.findAll().subscribe({
      next: (res) => {
        this.items = res.result;
        this.filteredItems = [...this.items];
        this.isLoading = false;
        this.isEmpty = this.items.length === 0;
      },
      error: (error) => {
        this.items = [];
        this.isLoading = false;
        this.isEmpty = true;
        console.error('Erro ao consultar dados: ', error);
        this.setMessage('Não foi possível carregar os dados!', 'error');
      }
    });
  }

  update(): void {
    this.isUpdate = true;

    const request = {
      id: this.updateForm.value.id,
      nome: this.updateForm.value.nome,
      funcao: this.updateForm.value.funcao,
      protocolo: this.updateForm.value.protocolo,
      contrato: this.updateForm.value.contrato,
      centro_custo: this.updateForm.value.centroCusto,
      status: this.updateForm.value.status,
      dt_envio_pesq_social: this.updateForm.value.pesquisaSocial,
      dt_prev_aprov_pesq_social: this.updateForm.value.prevAprovPesqSocial,
      treinamento: this.updateForm.value.treinamento,
      ficha_epi: this.updateForm.value.fichaEPI,
      dt_envio_doc: this.updateForm.value.envioDoc,
      dt_prev_aprov_doc: this.updateForm.value.prevAprovDoc,
      os: this.updateForm.value.os,
      aso: this.updateForm.value.aso,
      dt_reenvio_doc: this.updateForm.value.reenvioDoc,
      dt_prev_aprov_reenvio_doc: this.updateForm.value.prevAprovReenvioDoc
    }

    this._brkService.update(request).subscribe({
      next: () => {
        this.isUpdate = false;
        this.isModalEdit = false;
        this.updateForm.reset();
        this.employee = '';
        this.setMessage('Colaborador Atualizado com sucesso!', 'success');
      },
      error: (error) => {
        this.isUpdate = false;
        this.isModalEdit = false;
        console.error('Erro ao atualizar colaborador: ', error);
        this.setMessage('Não foi possível atualizar o colaborador!', 'error');
      }
    });
  }

  create(): void {
    this.isCreate = true;

    const request = {
      id: this.createForm.value.id,
      nome: this.createForm.value.nome,
      funcao: this.createForm.value.funcao,
      protocolo: this.createForm.value.protocolo,
      contrato: this.createForm.value.contrato,
      centro_custo: this.createForm.value.centroCusto,
      status: this.createForm.value.status,
      dt_envio_pesq_social: this.createForm.value.pesquisaSocial,
      dt_prev_aprov_pesq_social: this.createForm.value.prevAprovPesqSocial,
      treinamento: this.createForm.value.treinamento,
      ficha_epi: this.createForm.value.fichaEPI,
      dt_envio_doc: this.createForm.value.envioDoc,
      dt_prev_aprov_doc: this.createForm.value.prevAprovDoc,
      os: this.createForm.value.os,
      aso: this.createForm.value.aso,
      dt_reenvio_doc: this.createForm.value.reenvioDoc,
      dt_prev_aprov_reenvio_doc: this.createForm.value.prevAprovReenvioDoc
    }

    this._brkService.create(request).subscribe({
      next: () => {
        this.isCreate = false;
        this.isModalCreate = false;
        this.createForm.reset();
        this.setMessage('Colaborador criado com sucesso!', 'success');
      },
      error: (error) => {
        this.isCreate = false;
        this.isModalCreate = false;
        console.error('Erro ao criar colaborador: ', error);
        this.setMessage('Não foi possível criar o colaborador!', 'error');
      }
    });
  }

  // ========== MODAL ========== //
  openModalCreate(): void {
    this.isModalCreate = true;
  }

  openModalEdit(item: any): void {
    this.isModalEdit = true;
    this.currentItem = item;

    this.updateForm.patchValue({
      id: item.id || '',
      nome: item.nome || '',
      funcao: item.funcao || '',
      protocolo: item.protocolo || '',
      contrato: item.contrato || '',
      centroCusto: item.centro_custo || '',
      status: item.status || '',
      pesquisaSocial: item.dt_envio_pesq_social || '',
      prevAprovPesqSocial: item.dt_prev_aprov_pesq_social || '',
      treinamento: item.treinamento || '',
      fichaEPI: item.ficha_epi || '',
      envioDoc: item.dt_envio_doc || '',
      prevAprovDoc: item.dt_prev_aprov_doc || '',
      os: item.os || '',
      aso: item.aso || '',
      reenvioDoc: item.dt_reenvio_doc || '',
      prevAprovReenvioDoc: item.dt_prev_aprov_reenvio_doc || '',
    });
  }

  closeModal(): void {
    this.isModalCreate = false;
    this.isModalEdit = false;
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

  // ========== AUXILIARES ========== //
  formateDate(date: string): string {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }
}


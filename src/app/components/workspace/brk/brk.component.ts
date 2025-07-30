import { tap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BrkService } from '../../../core/services/brk.service';
import { TitleService } from '../../../core/services/title.service';

// Interface para tipagem dos contadores
interface StatusCounts {
  'NOVO': number;
  'EM AGUARDO': number;
  'LIBERADO': number;
  'CANCELADO': number;
}

// Tipo para as chaves dos status
type StatusKey = keyof StatusCounts;

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
  findForm: FormGroup = new FormGroup({
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
  });

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
  });

  // ========== ESTADOS ========== //
  items: any[] = [];
  currentItem: any = null;
  filteredItems: any[] = [];

  employee: string = '';
  selectedStatus: StatusKey = 'NOVO';

  statusCounts: StatusCounts = {
    'NOVO': 0,
    'EM AGUARDO': 0,
    'LIBERADO': 0,
    'CANCELADO': 0
  };

  isModalCreate: boolean = false;
  isModalEdit: boolean = false;
  isModalDelete: boolean = false;

  isFind: boolean = false;
  isEmpty: boolean = false;
  isLoading: boolean = true;

  isCreate: boolean = false;
  isUpdate: boolean = false;
  isDelete: boolean = false;

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  // ========== HOOK ========== //
  ngOnInit(): void {
    this.loadInitialData();
    this._titleService.setTitle('BRK');
  }

  // ========== CARREGAMENTO INICIAL ========== //
  loadInitialData(): void {
    this.items = [];
    this.isFind = true;
    this.isEmpty = false;
    this.isLoading = true;
    const centro_custo = this.findForm.value.centroCusto;

    forkJoin({
      contadores: this.loadStatusCounts(centro_custo),
      dadosIniciais: this._brkService.findItemsByStatus(centro_custo, this.selectedStatus)
    }).subscribe({
      next: (result: any) => {
        this.isLoading = false;
        this.isFind = false;
        this.items = result.dadosIniciais.result || [];
        this.filteredItems = [...this.items];
        this.isEmpty = this.items.length === 0;
        this.applyFilters();
      },
      error: (error) => {
        this.isLoading = false;
        this.isEmpty = true;
        this.isFind = false;
        console.log('Erro ao consultar dados: ', error);
        this.setMessage('Não foi possível carregar os dados!', 'error');
      }
    });
  }

  // ========== CARREGAMENTO DE CONTADORES ========== //
  loadStatusCounts(centroCusto: string): Observable<any> {
    const statusList: StatusKey[] = ['NOVO', 'EM AGUARDO', 'LIBERADO', 'CANCELADO'];

    const requests = statusList.map(status =>
      this._brkService.findItemsByStatus(centroCusto, status)
    );

    return forkJoin(requests).pipe(
      tap((results: any[]) => {
        statusList.forEach((status: StatusKey, index: number) => {
          this.statusCounts[status] = results[index]?.result?.length || 0;
        });
      })
    );
  }

  // ========== API ========== //
  findByCC(): void {
    this.loadInitialData();
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
        this.createForm.reset({
          id: '',
          nome: '',
          funcao: '',
          protocolo: '',
          contrato: '',
          centroCusto: '',
          status: '',
          pesquisaSocial: '',
          prevAprovPesqSocial: '',
          treinamento: '',
          fichaEPI: '',
          envioDoc: '',
          prevAprovDoc: '',
          os: '',
          aso: '',
          reenvioDoc: '',
          prevAprovReenvioDoc: ''
        });
        this.isEmpty = this.items.length === 0;
        this.refreshCurrentView();
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
        this.setMessage('Colaborador atualizado com sucesso!', 'success');
        this.refreshCurrentView();
      },
      error: (error) => {
        this.isUpdate = false;
        this.isModalEdit = false;
        console.error('Erro ao atualizar colaborador: ', error);
        this.setMessage('Não foi possível atualizar o colaborador!', 'error');
      }
    });
  }

  delete(): void {
    this.isDelete = true;

    const id = this.currentItem.id;

    this._brkService.delete(id).subscribe({
      next: () => {
        this.isDelete = false;
        this.isModalEdit = false;
        this.employee = '';
        this.setMessage('Colaborador deletado com sucesso!', 'success');
        this.refreshCurrentView();
      },
      error: (error) => {
        this.isDelete = false;
        console.error('Erro ao deletar colaborador: ', error);
        this.setMessage('Falha ao atualizar colaborador!', 'error');
      }
    });
  }

  // ========== FILTROS POR STATUS ========== //
  filterByStatus(status: string): void {
    const statusKey = status as StatusKey;

    if (this.selectedStatus === statusKey) return;

    this.selectedStatus = statusKey;
    this.employee = '';
    this.items = [];
    this.isEmpty = false;
    this.isLoading = true;

    const centro_custo = this.findForm.value.centroCusto;

    this._brkService.findItemsByStatus(centro_custo, status).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.items = res.result || [];
        this.filteredItems = [...this.items];
        this.isEmpty = this.items.length === 0;
        this.applyFilters();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao filtrar por status:', error);
        this.setMessage('Erro ao carregar dados do status selecionado!', 'error');
      }
    });
  }

  // ========== ATUALIZAÇÃO DA VISUALIZAÇÃO ATUAL ========== //
  refreshCurrentView(): void {
    const centro_custo = this.findForm.value.centroCusto;

    forkJoin({
      contadores: this.loadStatusCounts(centro_custo),
      dadosAtuais: this._brkService.findItemsByStatus(centro_custo, this.selectedStatus)
    }).subscribe({
      next: (result: any) => {
        this.items = result.dadosAtuais.result || [];
        this.filteredItems = [...this.items];
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erro ao atualizar visualização:', error);
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

  openModalDelete(item: any): void {
    this.isModalDelete = true;
    this.currentItem = item;
  }

  closeModal(): void {
    this.isModalCreate = false;
    this.isModalEdit = false;
    this.isModalDelete = false;
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

    // Filtro por nome do colaborador
    if (this.employee) {
      const inputValue = this.employee.toUpperCase();
      data = data.filter(item =>
        item.nome && item.nome.toUpperCase().includes(inputValue)
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

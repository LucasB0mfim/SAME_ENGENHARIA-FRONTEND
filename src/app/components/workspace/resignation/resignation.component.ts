import { tap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { ResignationService } from '../../../core/services/resignation.service';

interface StatusCounts {
  'NOVA SOLICITAÇÃO': number;
  'EM ANDAMENTO': number;
  'AVISO TRABALHADO': number;
  'DEMITIDO': number;
  'DESLIGADO': number;
}

type StatusKey = keyof StatusCounts;

@Component({
  selector: 'app-resignation',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './resignation.component.html',
  styleUrl: './resignation.component.scss'
})
export class ResignationComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private readonly _resignationService = inject(ResignationService);

  // ========== FORMULÁRIOS ========== //
  createForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl(''),
    funcao: new FormControl(''),
    centroCusto: new FormControl(''),
    status: new FormControl(''),
    modalidade: new FormControl(''),
    dataComunicacao: new FormControl(''),
    observacao: new FormControl('')
  });

  updateForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl(''),
    funcao: new FormControl(''),
    centroCusto: new FormControl(''),
    status: new FormControl(''),
    modalidade: new FormControl(''),
    colaboradorComunicado: new FormControl(''),
    dataInicioAvisoTrabalhado: new FormControl(''),
    dataRescisao: new FormControl(''),
  });

  // ========== ESTADOS ========== //
  items: any[] = [];
  currentItem: any = null;
  filteredItems: any[] = [];

  employee: string = '';
  selectedStatus: StatusKey = 'NOVA SOLICITAÇÃO';

  statusCounts: StatusCounts = {
    'NOVA SOLICITAÇÃO': 0,
    'EM ANDAMENTO': 0,
    'AVISO TRABALHADO': 0,
    'DEMITIDO': 0,
    'DESLIGADO': 0
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
    this._titleService.setTitle('Desligamento');
  }

  // ========== CARREGAMENTO INICIAL ========== //
  loadInitialData(): void {
    this.items = [];
    this.isFind = true;
    this.isEmpty = false;
    this.isLoading = true;

    forkJoin({
      contadores: this.loadStatusCounts(),
      dadosIniciais: this._resignationService.findByStatus(this.selectedStatus)
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
  loadStatusCounts(): Observable<any> {
    const statusList: StatusKey[] = ['NOVA SOLICITAÇÃO', 'EM ANDAMENTO', 'AVISO TRABALHADO', 'DEMITIDO', 'DESLIGADO'];

    const requests = statusList.map(status =>
      this._resignationService.findByStatus(status)
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
  create(): void {
    const date = new Date();
    const currentDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    this.isCreate = true;

    const request = {
      nome: this.createForm.value.nome,
      funcao: this.createForm.value.funcao,
      centro_custo: this.createForm.value.centroCusto,
      status: this.createForm.value.status,
      modalidade: this.createForm.value.modalidade,
      data_comunicacao: this.createForm.value.dataComunicacao,
      observacao: this.createForm.value.observacao,
      data_solicitacao: currentDate
    }

    this._resignationService.create(request).subscribe({
      next: () => {
        this.isCreate = false;
        this.isModalCreate = false;
        this.createForm.reset({
          id: '',
          nome: '',
          funcao: '',
          centroCusto: '',
          status: '',
          modalidade: '',
          dataComunicacao: '',
          observacao: ''
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
      centro_custo: this.updateForm.value.centroCusto,
      status: this.updateForm.value.status,
      modalidade: this.updateForm.value.modalidade,
      colaborador_comunicado: this.updateForm.value.colaboradorComunicado,
      data_inicio_aviso_trabalhado: this.updateForm.value.dataInicioAvisoTrabalhado,
      data_rescisao: this.updateForm.value.dataRescisao
    }

    this._resignationService.update(request).subscribe({
      next: () => {
        this.isUpdate = false;
        this.isModalEdit = false;
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

    this._resignationService.delete(id).subscribe({
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

    this._resignationService.findByStatus(status).subscribe({
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
    forkJoin({
      contadores: this.loadStatusCounts(),
      dadosAtuais: this._resignationService.findByStatus(this.selectedStatus)
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
      centroCusto: item.centro_custo || '',
      status: item.status || '',
      modalidade: item.modalidade || '',
      colaboradorComunicado: item.colaborador_comunicado || '',
      dataInicioAvisoTrabalhado: item.data_inicio_aviso_trabalhado || '',
      dataRescisao: item.data_rescisao || ''
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

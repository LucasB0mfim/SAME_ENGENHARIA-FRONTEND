import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { ResignationService } from '../../../core/services/resignation.service';
import { BenefitService } from '../../../core/services/benefit.service';

@Component({
  selector: 'app-resignation',
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './resignation.component.html',
  styleUrl: './resignation.component.scss'
})
export class ResignationComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private readonly _resignationService = inject(ResignationService);
  private readonly _benefitService = inject(BenefitService);

  // ========== FORMULÁRIOS ========== //
  updateForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl(''),
    funcao: new FormControl(''),
    centro_custo: new FormControl(''),
    status: new FormControl(''),
    modalidade: new FormControl(''),
    colaborador_comunicado: new FormControl(''),
    data_demissao: new FormControl(''),
    data_inicio_aviso_trabalhado: new FormControl(''),
    data_pagamento_rescisao: new FormControl(''),
    data_rescisao: new FormControl(''),
    data_solicitacao: new FormControl(''),
    data_ultimo_dia_trabalhado: new FormControl('')
  });

  createForm: FormGroup = new FormGroup({
    nome: new FormControl('', Validators.required),
    funcao: new FormControl('', Validators.required),
    centro_custo: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    modalidade: new FormControl('', Validators.required),
    data_comunicacao: new FormControl('', Validators.required),
    observacao: new FormControl('')
  });

  // ========== ESTADOS ========== //
  items: any[] = [];
  currentItem: any = [];
  filteredItems: any[] = [];

  isLoading: boolean = true;
  isEmpty: boolean = false;
  isDeleting: boolean = false;
  isGenerating: boolean = false;
  isUpdating: boolean = false;
  isCreating: boolean = false;

  funcoes: string[] = [];
  centroCustos: string[] = [];

  message: string = '';
  messageType: 'success' | 'error' = 'success';
  showMessage: boolean = false;

  isBodyVisible: boolean[] = [];

  isModalCreate: boolean = false;
  isModalEdit: boolean = false;
  isModalDelete: boolean = false;

  activeStatus: string = 'NOVA SOLICITAÇÃO';

  requestCount: number = 0;
  progressCount: number = 0;
  terminatedCount: number = 0;
  firedCount: number = 0;
  noticeWorkedCount: number = 0;

  // ========== HOOK ========== //
  ngOnInit(): void {
    this.findAll();
    this.findInfo();
    this._titleService.setTitle('Desligamento');
  }

  // ========== API ========== //
  findAll(): void {
    this._resignationService.findAll().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.items = res.result;
        this.updateStatusCounts();
        this.filterItemsByStatus(this.activeStatus);
      },
      error: (error) => {
        this.isEmpty = true;
        this.isLoading = false;
        this.setMessage('Não foi possível carregar os dados.', 'error');
        console.error(error);
      }
    })
  }

  findInfo(): void {
    this._benefitService.findAll().subscribe({
      next: (res) => {
        const centroCustoSet = new Set<string>();
        const funcaoSet = new Set<string>();

        res.result.forEach((item: any) => {
          if (item.centro_custo) centroCustoSet.add(item.centro_custo);
          if (item.funcao) funcaoSet.add(item.funcao);
        });

        this.centroCustos = Array.from(centroCustoSet).sort();
        this.funcoes = Array.from(funcaoSet).sort();
      },
      error: (error) => {
        console.error(error);
        this.setMessage('Erro ao carregar informações de centro de custo e função.', 'error');
      }
    });
  }

  create(): void {
    const date = new Date();
    const currentDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    this.isCreating = true;

    const request = {
      nome: this.createForm.value.nome,
      funcao: this.createForm.value.funcao,
      centro_custo: this.createForm.value.centro_custo,
      status: this.createForm.value.status,
      modalidade: this.createForm.value.modalidade,
      data_comunicacao: this.createForm.value.data_comunicacao,
      observacao: this.createForm.value.observacao,
      data_solicitacao: currentDate
    }

    this._resignationService.create(request).subscribe({
      next: () => {
        this.isCreating = false;
        this.isModalCreate = false;
        this.findAll();
        this.createForm.reset({
          nome: '',
          funcao: '',
          centro_custo: '',
          status: '',
          modalidade: '',
          data_comunicacao: '',
          observacao: ''
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.isCreating = false;
        console.error('Erro ao gerar solicitação:', error);
        this.setMessage("Erro ao criar solicitação! Tente novamente outra hora.", 'error');
      }
    });
  }

  update(): void {
    this.isUpdating = true;

    const request = {
      id: this.updateForm.value.id,
      status: this.updateForm.value.status,
      modalidade: this.updateForm.value.modalidade,
      colaborador_comunicado: this.updateForm.value.colaborador_comunicado,
      data_demissao: this.updateForm.value.data_demissao,
      data_inicio_aviso_trabalhado: this.updateForm.value.data_inicio_aviso_trabalhado,
      data_pagamento_rescisao: this.updateForm.value.data_pagamento_rescisao,
      data_rescisao: this.updateForm.value.data_rescisao,
      data_solicitacao: this.updateForm.value.data_solicitacao,
      data_ultimo_dia_trabalhado: this.updateForm.value.data_ultimo_dia_trabalhado,
    }

    this._resignationService.update(request).subscribe({
      next: () => {
        this.isUpdating = false;
        this.isModalEdit = false;
        this.findAll();
        this.setMessage('Solicitação atualizado com sucesso!', 'success');
      },
      error: (error) => {
        this.isUpdating = false;
        console.error('Erro ao atualizar solicitação: ', error);
        this.setMessage('Não foi possível atualizar a solicitação!', 'error');
      }
    });
  }

  delete(): void {
    this.isDeleting = true;

    const id = this.currentItem.id;

    this._resignationService.delete(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.isModalDelete = false;
        this.findAll();
        this.setMessage('Solicitação deletada com sucesso!', 'success')
      },
      error: (error) => {
        this.isDeleting = false;;
        this.setMessage('Não foi possível deletar o registro!', 'error');
        console.error('Erro ao deletar registro: ', error);
      }
    })
  }

  // ========== GERENCIAR STATUS ========== //
  onStatusButtonClick(status: string): void {
    this.filterItemsByStatus(status);
  }

  filterItemsByStatus(status: string): void {
    this.activeStatus = status;
    this.filteredItems = this.items.filter(item => item.status === status);
    this.isEmpty = this.filteredItems.length === 0;
  }

  // ========== GERENCIAR CORPO ========== //
  toggleBodyVisibility(index: number): void {
    this.isBodyVisible[index] = !this.isBodyVisible[index];
  }

  // ========== GERENCIAR MODAL ========== //
  openModalCreate(): void {
    this.isModalCreate = true;
  }

  openModalEdit(item: any): void {
    this.currentItem = item;
    this.isModalEdit = true;

    this.updateForm.patchValue({
      id: item.id,
      nome: item.nome,
      funcao: item.funcao,
      status: item.status,
      centro_custo: item.centro_custo,
      modalidade: item.modalidade,
      colaborador_comunicado: item.colaborador_comunicado,
      data_demissao: item.data_demissao,
      data_inicio_aviso_trabalhado: item.data_inicio_aviso_trabalhado,
      data_rescisao: item.data_rescisao,
      data_ultimo_dia_trabalhado: item.data_ultimo_dia_trabalhado,
      data_pagamento_rescisao: item.data_pagamento_rescisao,
      data_solicitacao: item.data_solicitacao
    });
  }

  openModalDelete(item: any): void {
    this.currentItem = item;
    this.isModalDelete = true;
  }

  closeModal(): void {
    this.isModalCreate = false;
    this.isModalEdit = false;
    this.isModalDelete = false;
  }

  // ========== CONTADOR DE STATUS ========== //
  private updateStatusCounts(): void {
    this.requestCount = 0;
    this.progressCount = 0;
    this.noticeWorkedCount = 0;
    this.firedCount = 0;
    this.terminatedCount = 0;

    if (this.items && Array.isArray(this.items)) {
      this.items.forEach((item: any) => {
        switch (item.status) {
          case 'NOVA SOLICITAÇÃO':
            this.requestCount++;
            break;
          case 'EM ANDAMENTO':
            this.progressCount++;
            break;
          case 'AVISO TRABALHADO':
            this.noticeWorkedCount++;
            break;
          case 'DEMITIDO':
            this.firedCount++;
            break;
          case 'DESLIGADO':
            this.terminatedCount++;
            break;
        }
      });
    }
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

  // ========== MÉTODOS AUXILIARES ========== //
  formateDate(date: string): string {
    if (!date) return '';

    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }
}

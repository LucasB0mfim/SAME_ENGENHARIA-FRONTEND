import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { BenefitService } from '../../../core/services/benefit.service';
import { ResignationService } from '../../../core/services/resignation.service';

@Component({
  selector: 'app-resignation',
  imports: [CommonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './resignation.component.html',
  styleUrl: './resignation.component.scss'
})
export class ResignationComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private readonly _titleService = inject(TitleService);
  private readonly _benefitService = inject(BenefitService);
  private readonly _resignationService = inject(ResignationService);

  // ========== FORMULÁRIO ========== //
  updateForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl('', Validators.required),
    funcao: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    centro_custo: new FormControl('', Validators.required),
    modalidade: new FormControl('', Validators.required),
    colaborador_comunicado: new FormControl('', Validators.required),
    data_demissao: new FormControl(''),
    data_inicio_aviso_trabalhado: new FormControl(''),
    data_rescisao: new FormControl(''),
    data_ultimo_dia_trabalhado: new FormControl(''),
    data_pagamento_rescisao: new FormControl(''),
    data_solicitacao: new FormControl(''),
    observacao: new FormControl('')
  });

  createForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl('', Validators.required),
    funcao: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    centro_custo: new FormControl('', Validators.required),
    modalidade: new FormControl(''),
    colaborador_comunicado: new FormControl(''),
    data_demissao: new FormControl(''),
    data_inicio_aviso_trabalhado: new FormControl(''),
    data_rescisao: new FormControl(''),
    data_ultimo_dia_trabalhado: new FormControl(''),
    data_pagamento_rescisao: new FormControl(''),
    data_solicitacao: new FormControl(''),
    observacao: new FormControl('')
  });

  // ========== ESTADOS ========== //
  items: any[] = [];
  currentItem: any = null;
  isModalEditVisible: boolean = false;
  isModalCreateVisible: boolean = false;
  isBodyVisible: boolean[] = [];

  showMessage: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  isEmpty: boolean = false;
  isCreating: boolean = false;
  isUpdating: boolean = false;
  isDelting: boolean = false;

  centroCustos: string[] = [];
  funcoes: string[] = [];

  // ========== HOOK ========== //
  ngOnInit(): void {
    this._titleService.setTitle('Desligamentos');
    this.findAll();
    this.findInfo();
  }

  // ========== API ========== //
  findAll(): void {
    this._resignationService.findAll().subscribe({
      next: (res) => {
        this.items = res.result;
      },
      error: (err) => {
        console.error(err);
      }
    });
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
    this.isCreating = true;

    const request = {
      id: this.createForm.value.id,
      nome: this.createForm.value.nome,
      funcao: this.createForm.value.funcao,
      status: this.createForm.value.status,
      centro_custo: this.createForm.value.centro_custo,
      modalidade: this.createForm.value.modalidade,
      colaborador_comunicado: this.createForm.value.colaborador_comunicado,
      data_demissao: this.createForm.value.data_demissao,
      data_inicio_aviso_trabalhado: this.createForm.value.data_inicio_aviso_trabalhado,
      data_rescisao: this.createForm.value.data_rescisao,
      data_ultimo_dia_trabalhado: this.createForm.value.data_ultimo_dia_trabalhado,
      data_pagamento_rescisao: this.createForm.value.data_pagamento_rescisao,
      data_solicitacao: this.createForm.value.data_solicitacao,
      observacao: this.createForm.value.observacao
    };

    this._resignationService.create(request).subscribe({
      next: (res) => {
        this.setMessage('Registro criado com sucesso.', 'success');
        this.closeModal();
        this.findAll();
        this.isCreating = false;
      },
      error: (error) => {
        console.error('Erro ao criar:', error);
        this.setMessage('Erro ao criar registro.', 'error');
        this.isCreating = false;
      }
    });
  }

  update(): void {

    if (this.updateForm.invalid) {
      this.setMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    this.isUpdating = true;

    const request = {
      id: this.updateForm.value.id,
      nome: this.updateForm.value.nome,
      funcao: this.updateForm.value.funcao,
      status: this.updateForm.value.status,
      centro_custo: this.updateForm.value.centro_custo,
      modalidade: this.updateForm.value.modalidade,
      colaborador_comunicado: this.updateForm.value.colaborador_comunicado,
      data_demissao: this.updateForm.value.data_demissao,
      data_inicio_aviso_trabalhado: this.updateForm.value.data_inicio_aviso_trabalhado,
      data_rescisao: this.updateForm.value.data_rescisao,
      data_ultimo_dia_trabalhado: this.updateForm.value.data_ultimo_dia_trabalhado,
      data_pagamento_rescisao: this.updateForm.value.data_pagamento_rescisao,
      data_solicitacao: this.updateForm.value.data_solicitacao,
      observacao: this.updateForm.value.observacao
    };

    this._resignationService.update(request).subscribe({
      next: (res) => {
        this.setMessage('Registro atualizado com sucesso.', 'success');
        this.closeModal();
        this.findAll();
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Erro ao atualizar:', error);
        this.setMessage('Erro ao atualizar registro.', 'error');
        this.isUpdating = false;
      }
    });
  }

  // ========== MENSAGEM ========== //
  setMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  }

  // ========== FILTROS ========== //
  getItemsByStatus(status: string): any[] {
    const items = this.items.filter(item => item.status === status);

    if (items.length === 0) {
      this.isEmpty = true;
    } else {
      this.isEmpty = false;
    }

    return items;
  }

  // ========== AUXILIARES ========== //
  formateDate(date: string): string {
    if (!date) return 'N/A';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  openModalCreate(): void {
    this.isModalCreateVisible = true;
  }

  openModalEdit(item: any): void {
    this.currentItem = item;
    this.isModalEditVisible = true;

    this.updateForm.patchValue({
      id: item.id,
      nome: item.nome || '',
      funcao: item.funcao || '',
      status: item.status || '',
      centro_custo: item.centro_custo || '',
      modalidade: item.modalidade || '',
      colaborador_comunicado: item.colaborador_comunicado || '',
      data_demissao: item.data_demissao || '',
      data_inicio_aviso_trabalhado: item.data_inicio_aviso_trabalhado || '',
      data_rescisao: item.data_rescisao || '',
      data_ultimo_dia_trabalhado: item.data_ultimo_dia_trabalhado || '',
      data_pagamento_rescisao: item.data_pagamento_rescisao || '',
      data_solicitacao: item.data_solicitacao || '',
      observacao: item.observacao || ''
    });
  }

  closeModal(): void {
    this.isModalEditVisible = false;
    this.isModalCreateVisible = false;
    this.updateForm.reset();
  }

  // ========== GERENCIAR MODAL ========== //
  toggleBodyVisibility(index: number): void {
    this.isBodyVisible[index] = !this.isBodyVisible[index];
  }
}
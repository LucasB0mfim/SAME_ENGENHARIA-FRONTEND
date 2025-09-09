import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../core/services/title.service';
import { EquipmentRentalService } from '../../../core/services/equipment-rental.service';

interface status {
  'NOVO': number;
  'ATIVO': number;
  'VENCIDO': number;
  'DEVOLVIDO': number;
}

type statusKey = keyof status;

@Component({
  selector: 'app-test',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {
  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private _equipamentService = inject(EquipmentRentalService);

  // ========== FORMULÁRIOS ========== //
  archiveForm: FormGroup = new FormGroup({
    idmov: new FormControl('', [Validators.required, Validators.min(10000)])
  });

  renewForm: FormGroup = new FormGroup({
    idmov_atual: new FormControl('', [Validators.required, Validators.min(10000)]),
    idmov_novo: new FormControl('', [Validators.required, Validators.min(10000)]),
    numero_contrato: new FormControl('', [Validators.required, Validators.min(10000)]),
    ordem_compra: new FormControl('', [Validators.required, Validators.min(1000)]),
    data_inicial: new FormControl('', Validators.required),
  });

  registerForm: FormGroup = new FormGroup({
    numero_contrato: new FormControl('', [Validators.required, Validators.min(1000)]),
    idmov: new FormControl('', [Validators.required, Validators.min(10000)]),
    ordem_compra: new FormControl('', [Validators.required, Validators.min(1000)]),
  });

  // ========== ESTADOS ========== //
  items: any[] = [];
  rawItems: any[] = [];
  filteredItems: any[] = [];
  costCenters: any = null;

  selectedStatus: statusKey = 'ATIVO';
  status: status = { 'NOVO': 0, 'ATIVO': 0, 'VENCIDO': 0, 'DEVOLVIDO': 0 };

  isFind: boolean = false;
  isEmpty: boolean = false;
  isLoading: boolean = false;
  isProcessing: boolean = false;

  isMenuOpen: boolean = false;
  isRegisterOpen: boolean = false;
  isArchiveOpen: boolean = false;
  isRenewOpen: boolean = false;

  idmov: string = '';
  costCenter: string = 'GERAL';

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  // ========== HOOK ========== //
  ngOnInit(): void {
    this.loadInitial();
    this._titleService.setTitle('Locação');
  }

  // ========== LOADING INICIAL OTIMIZADO ========== //
  loadInitial(): void {
    this.items = [];
    this.isEmpty = false;
    this.isLoading = true;

    const statusList: statusKey[] = ['NOVO', 'ATIVO', 'VENCIDO', 'DEVOLVIDO'];

    const requests = statusList.map(status =>
      this._equipamentService.findByStatus(status)
    );

    forkJoin(requests)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {

          statusList.forEach((status: statusKey, index: number) => {
            const data = res[index]?.result || [];
            this.status[status] = data.length;
          });

          this.rawItems = res[1]?.result || [];
          this.filteredItems = this.convertJson(this.rawItems);
          this.items = [...this.filteredItems];

          this.costCenters = [...new Set(this.filteredItems.map((item) => item.centro_custo))];

          this.isEmpty = this.items.length === 0;

          this.applyFilters();
        },
        error: (err) => {
          this.isEmpty = true;
          console.error('Não foi possível buscar os contratos:', err);
        }
      });
  }

  // ========== BUSCAR CONTRATO POR STATUS ========== //
  getByStatus(status: string): void {
    const statusKey = status as statusKey;
    this.selectedStatus = statusKey;

    this.items = [];
    this.isEmpty = false;
    this.isLoading = true;

    this._equipamentService.findByStatus(status)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          const data = res.result || [];

          this.rawItems = data;
          this.filteredItems = this.convertJson(this.rawItems);

          this.items = [...this.filteredItems];

          this.status[statusKey] = data.length;
          this.isEmpty = this.items.length === 0;
        },
        error: (err) => {
          this.isEmpty = true;
          console.error('Erro ao buscar contratos:', err);
          this.setMessage('Erro ao buscar contratos!', 'error');
        }
      });
  }

  onRegister(): void {
    this.isProcessing = true;

    const request = {
      idmov: this.registerForm.value.idmov,
      numero_contrato: this.registerForm.value.numero_contrato,
      ordem_compra: this.registerForm.value.ordem_compra
    }

    this._equipamentService.register(request)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe({
        next: (res) => {
          this.loadInitial();
          this.isRegisterOpen = false;
          this.setMessage(res.message, 'success');
          this.registerForm.reset({
            numero_contrato: '',
            idmov: '',
            ordem_compra: ''
          });
        },
        error: (err) => {
          this.setMessage(err.error.message, 'error');
          console.error('Erro ao atualizar contrato: ', err);
        }
      });
  }

  onRenew(): void {
    this.isProcessing = true;

    const request = {
      idmov_atual: this.renewForm.value.idmov_atual,
      idmov_novo: this.renewForm.value.idmov_novo,
      numero_contrato: this.renewForm.value.numero_contrato,
      ordem_compra: this.renewForm.value.ordem_compra,
      data_inicial: this.renewForm.value.data_inicial,
    }

    this._equipamentService.renew(request)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe({
        next: (res) => {
          this.loadInitial();
          this.isRenewOpen = false;
          this.setMessage(res.message, 'success');

          this.renewForm.reset({
            idmov_atual: '',
            idmov_novo: '',
            numero_contrato: '',
            ordem_compra: '',
            data_inicial: ''
          });
        },
        error: (err) => {
          this.setMessage(err.error.message, 'error');
          console.error('Erro ao atualizar contrato: ', err);
        }
      });
  }

  onArchive(): void {
    this.isProcessing = true;

    const idmov = this.archiveForm.value.idmov;
    this._equipamentService.archive(idmov)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe({
        next: (res) => {
          this.loadInitial();
          this.isArchiveOpen = false;
          this.setMessage(res.message, 'success');

          this.archiveForm.reset({
            idmov: ''
          });
        },
        error: (err) => {
          this.setMessage(err.error.message, 'error');
          console.error('Erro ao atualizar contrato: ', err);
        }
      });
  }

  // ========== ABRIR MODAL ========== //
  openMenu(): void {
    this.isMenuOpen = true;
  }

  // ========== FECHAR MODAL ========== //
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  // ========== ABRIR MODAL ========== //
  openRegister(): void {
    this.isMenuOpen = false;
    this.isRegisterOpen = true;
  }

  // ========== FECHAR MODAL ========== //
  closeRegister(): void {
    this.isRegisterOpen = false;
  }

  // ========== ABRIR MODAL ========== //
  openRenew(): void {
    this.isMenuOpen = false;
    this.isRenewOpen = true;
  }

  // ========== FECHAR MODAL ========== //
  closeRenew(): void {
    this.isRenewOpen = false;
  }

  // ========== ABRIR MODAL ========== //
  openArchive(): void {
    this.isMenuOpen = false;
    this.isArchiveOpen = true;
  }

  // ========== FECHAR MODAL ========== //
  closeArchive(): void {
    this.isArchiveOpen = false;
  }

  // ========== RETORNAR AO MENU ========== //
  returnMenu(): void {
    this.isArchiveOpen = false;
    this.isRegisterOpen = false;
    this.isRenewOpen = false;
    this.isMenuOpen = true;
  }

  // ========== FILTROS ========== //
  applyFilters() {
    let data = [...this.filteredItems];

    if (this.idmov) {
      const inputValue = this.idmov.trim();
      data = data.filter(item =>
        item.contrato.idmov && item.contrato.idmov.toString().includes(inputValue)
      );
    }

    if (this.costCenter && this.costCenter !== 'GERAL') {
      const inputValue = this.costCenter;
      data = data.filter(item =>
        item.centro_custo && item.centro_custo.includes(inputValue)
      );
    }

    this.items = data;
    this.isEmpty = this.items.length === 0;
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

  // ========== FORMATAR DATA ========== //
  formateDate(date: string): string {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  // ========== CONVERTER PARA MAIUSCULO ========== //
  upperCase(string: string): string {
    return string.trim().toUpperCase();
  }

  // ========== CONVERTER JSON ========== //
  convertJson(data: any[]): any[] {
    return data.flatMap(item => {
      return item.contrato_base.contrato_itens.map((equip: any) => ({
        ...equip,
        centro_custo: item.contrato_base.centro_custo,
        movimento: item.contrato_base.movimento,
        criador: item.contrato_base.criador,
        unidade: item.contrato_base.unidade,
        foto_equipamento: item.contrato_base.foto_equipamento,
        fornecedor: item.contrato_base.fornecedor,
        contrato: {
          contrato_id: item.contrato_id,
          numero_contrato: item.numero_contrato,
          periodo: item.periodo,
          ordem_compra: item.ordem_compra,
          idmov: item.idmov,
          data_inicial: item.data_inicial,
          data_final: item.data_final,
          valor: item.valor,
          status: item.status
        }
      }));
    });
  }
}

import { tap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BrkService } from '../../../../core/services/brk.service';
import { TitleService } from '../../../../core/services/title.service';
import { BenefitService } from '../../../../core/services/benefit.service';

// Interface para tipagem dos contadores
interface StatusCounts {
  'NOVO': number;
  'PESQUISA SOCIAL': number;
  'DOCUMENTAÇÃO': number;
  'INTEGRAÇÃO': number;
  'LIBERADO': number;
  'PAUSADO': number;
  'CANCELADO': number;
}

// Tipo para as chaves dos status
type StatusKey = keyof StatusCounts | 'OUTRO';

@Component({
  selector: 'app-brk',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatProgressSpinnerModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './brk.component.html',
  styleUrl: './brk.component.scss'
})
export class BrkComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private readonly _brkService = inject(BrkService);
  private readonly _benefitService = inject(BenefitService);

  // ========== FORMULÁRIOS ========== //
  findForm: FormGroup = new FormGroup({
    centroCusto: new FormControl('GERAL')
  })

  createForm: FormGroup = new FormGroup({
    nome: new FormControl(''),
    funcao: new FormControl(''),
    contrato: new FormControl(''),
    centroCusto: new FormControl(''),
    status: new FormControl(''),
    observacao: new FormControl('')
  });

  updateForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl(''),
    funcao: new FormControl(''),
    contrato: new FormControl(''),
    status: new FormControl(''),
    centroCusto: new FormControl(''),
    pesquisaSocial: new FormControl(''),
    envioDoc: new FormControl(''),
    reenvioDoc: new FormControl(''),
    os: new FormControl(''),
    aso: new FormControl(''),
    treinamento: new FormControl(''),
    fichaEPI: new FormControl(''),
    observacao: new FormControl(''),
  });

  // ========== ESTADOS ========== //
  items: any[] = [];
  currentItem: any = null;
  filteredItems: any[] = [];

  employeeInfo: any[] = [];

  employee: string = '';
  selectedStatus: StatusKey = 'NOVO';

  statusCounts: StatusCounts = {
    'NOVO': 0,
    'PESQUISA SOCIAL': 0,
    'DOCUMENTAÇÃO': 0,
    'INTEGRAÇÃO': 0,
    'LIBERADO': 0,
    'PAUSADO': 0,
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
    this.getEmployeeInfo();
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
    const statusList: (keyof StatusCounts)[] = ['NOVO', 'PESQUISA SOCIAL', 'INTEGRAÇÃO', 'DOCUMENTAÇÃO', 'INTEGRAÇÃO', 'LIBERADO', 'PAUSADO', 'CANCELADO'];

    const requests = statusList.map(status =>
      this._brkService.findItemsByStatus(centroCusto, status)
    );

    return forkJoin(requests).pipe(
      tap((results: any[]) => {
        statusList.forEach((status: keyof StatusCounts, index: number) => {
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
      nome: this.createForm.value.nome,
      funcao: this.createForm.value.funcao,
      contrato: this.createForm.value.contrato,
      centro_custo: this.createForm.value.centroCusto,
      status: this.createForm.value.status,
      observacao: this.createForm.value.observacao,
    }

    this._brkService.create(request).subscribe({
      next: () => {
        this.isCreate = false;
        this.isModalCreate = false;
        this.createForm.reset({
          nome: '',
          funcao: '',
          contrato: '',
          centroCusto: '',
          status: '',
          observacao: '',
        });
        this.refreshCurrentView();
        this.setMessage('Colaborador criado com sucesso!', 'success');
      },
      error: (error) => {
        this.isCreate = false;
        console.error('Erro ao criar colaborador: ', error);
        if (error.status === 400) {
          this.setMessage("Preencha todos os campos obrigatórios (*)", 'error');
        } else if (error.status === 409) {
          this.setMessage("Colaborador já registrado!", 'error');
        } else {
          this.setMessage('Erro interno! Tente novamente outra hora.', 'error');
        }
      }
    });
  }

  update(): void {
    this.isUpdate = true;

    const request = {
      id: this.updateForm.value.id,
      nome: this.updateForm.value.nome,
      funcao: this.updateForm.value.funcao,
      contrato: this.updateForm.value.contrato,
      centro_custo: this.updateForm.value.centroCusto,
      status: this.updateForm.value.status,
      dt_envio_pesq_social: this.updateForm.value.pesquisaSocial,
      treinamento: this.updateForm.value.treinamento,
      ficha_epi: this.updateForm.value.fichaEPI,
      dt_envio_doc: this.updateForm.value.envioDoc,
      os: this.updateForm.value.os,
      aso: this.updateForm.value.aso,
      dt_reenvio_doc: this.updateForm.value.reenvioDoc,
      observacao: this.updateForm.value.observacao
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

  getEmployeeInfo(): void {
    this._benefitService.findBasicInfo().subscribe({
      next: (res) => {
        this.employeeInfo = res.result;
      }
    });
  }

  // ========== FILTROS POR STATUS ========== //
  filterByStatus(status: string): void {
    const statusKey = status as keyof StatusCounts;

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

  // ========== FILTRO POR MÚLTIPLOS STATUS (OUTROS) ========== //
  filterByOtherStatus(): void {
    if (this.selectedStatus === 'OUTRO') return;

    this.selectedStatus = 'OUTRO';
    this.employee = '';
    this.items = [];
    this.isEmpty = false;
    this.isLoading = true;

    const centro_custo = this.findForm.value.centroCusto;
    const statusesToFilter = ['PAUSADO', 'CANCELADO'];

    // Fazemos requisições para ambos os status
    const requests = statusesToFilter.map(status =>
      this._brkService.findItemsByStatus(centro_custo, status)
    );

    forkJoin(requests).subscribe({
      next: (results: any[]) => {
        this.isLoading = false;

        // Combinamos os resultados de ambos os status
        const combinedItems: any[] = [];
        results.forEach(result => {
          if (result.result && Array.isArray(result.result)) {
            combinedItems.push(...result.result);
          }
        });

        this.items = combinedItems;
        this.filteredItems = [...this.items];
        this.isEmpty = this.items.length === 0;
        this.applyFilters();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao filtrar por status outros:', error);
        this.setMessage('Erro ao carregar dados dos status selecionados!', 'error');
      }
    });
  }

  // ========== ATUALIZAÇÃO DA VISUALIZAÇÃO ATUAL ========== //
  refreshCurrentView(): void {
    const centro_custo = this.findForm.value.centroCusto;

    if (this.selectedStatus === 'OUTRO') {
      // Se o status selecionado é 'OUTRO', recarregamos os dados combinados
      forkJoin({
        contadores: this.loadStatusCounts(centro_custo),
        pausados: this._brkService.findItemsByStatus(centro_custo, 'PAUSADO'),
        cancelados: this._brkService.findItemsByStatus(centro_custo, 'CANCELADO')
      }).subscribe({
        next: (result: any) => {
          const combinedItems: any[] = [];

          if (result.pausados.result && Array.isArray(result.pausados.result)) {
            combinedItems.push(...result.pausados.result);
          }

          if (result.cancelados.result && Array.isArray(result.cancelados.result)) {
            combinedItems.push(...result.cancelados.result);
          }

          this.items = combinedItems;
          this.filteredItems = [...this.items];
          this.applyFilters();
        },
        error: (error) => {
          console.error('Erro ao atualizar visualização outros:', error);
        }
      });
    } else {
      // Para outros status, mantemos a lógica original
      forkJoin({
        contadores: this.loadStatusCounts(centro_custo),
        dadosAtuais: this._brkService.findItemsByStatus(centro_custo, this.selectedStatus)
      }).subscribe({
        next: (result: any) => {
          this.items = result.dadosAtuais.result || [];
          this.filteredItems = [...this.items];
          this.isEmpty = this.items.length === 0;
          this.applyFilters();
        },
        error: (error) => {
          console.error('Erro ao atualizar visualização:', error);
        }
      });
    }
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
      contrato: item.contrato || '',
      centroCusto: item.centro_custo || '',
      status: item.status || '',
      pesquisaSocial: item.dt_envio_pesq_social || '',
      treinamento: item.treinamento || '',
      fichaEPI: item.ficha_epi || '',
      envioDoc: item.dt_envio_doc || '',
      os: item.os || '',
      aso: item.aso || '',
      reenvioDoc: item.dt_reenvio_doc || '',
      observacao: item.observacao || '',
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


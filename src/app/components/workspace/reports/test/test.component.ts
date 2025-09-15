import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormControl } from '@angular/forms';

import { TitleService } from '../../../../core/services/title.service';
import { EquipmentRentalService } from '../../../../core/services/equipment-rental.service';
import { DashboardService } from '../../../../core/services/dashboard.service';

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
  private _userService = inject(DashboardService);

  // ========== FORMULÁRIOS ========== //
  registerForm: FormGroup = new FormGroup({
    numero_contrato: new FormControl('', [Validators.required, Validators.minLength(4)]),
    idmov: new FormControl('', [Validators.required, Validators.min(10000)])
  });

  activeForm: FormGroup = new FormGroup({
    numero_contrato: new FormControl('', [Validators.required, Validators.minLength(4)]),
    idmov: new FormControl('', [Validators.required, Validators.min(10000)]),
    ordem_compra: new FormControl('', [Validators.required, Validators.min(1000)]),
  });

  renewForm: FormGroup = new FormGroup({
    idmov_atual: new FormControl('', [Validators.required, Validators.min(10000)]),
    idmov_novo: new FormControl('', [Validators.required, Validators.min(10000)]),
    numero_contrato: new FormControl('', [Validators.required, Validators.minLength(4)]),
    ordem_compra: new FormControl('', [Validators.required, Validators.min(1000)]),
    data_inicial: new FormControl('', Validators.required),
  });

  archiveForm: FormGroup = new FormGroup({
    idmov: new FormControl('', [Validators.required, Validators.min(10000)]),
    numero_contrato: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  historyForm: FormGroup = new FormGroup({
    numero_contrato: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  // ========== ESTADOS ========== //
  items: any[] = [];
  rawItems: any[] = [];
  groupItems: any[] = [];
  filteredItems: any[] = [];

  userInfo: any = null;

  costCenters: any = null;

  selectedStatus: statusKey = 'ATIVO';
  status: status = { 'NOVO': 0, 'ATIVO': 0, 'VENCIDO': 0, 'DEVOLVIDO': 0 };

  isFind: boolean = false;
  isEmpty: boolean = false;
  isLoading: boolean = false;
  isProcessing: boolean = false;

  isMenuOpen: boolean = false;
  isRegisterOpen: boolean = false;
  isActiveOpen: boolean = false;
  isArchiveOpen: boolean = false;
  isRenewOpen: boolean = false;
  isHistoryOpen: boolean = false;
  isHistory: boolean = false;

  uploadedFile: File | null = null;
  compressedFile: File | null = null;

  idmov: string = '';
  costCenter: string = 'GERAL';

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  // ===== CONFIGURAÇÕES FIXAS DE COMPRESSÃO ===== //
  private readonly MAX_WIDTH = 800;
  private readonly MAX_HEIGHT = 600;
  private readonly QUALITY = 0.3;

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

  // ========== BUSCAR DADOS DO USUÁRIO ========== //
  getUser(): void {
    this._userService.findAll().subscribe({
      next: (res) => {
        this.userInfo = res.employee;
      },
      error: (err) => {
        this.setMessage(err.error.message, 'error');
        console.error('Erro ao carregar dados do colaborador: ', err);
      }
    });
  }

  // ========== REGISTRAR CONTRATO ========== //
  onRegister(): void {
    this.isProcessing = true;

    if (!this.compressedFile && !this.uploadedFile) {
      this.isProcessing = false;
      this.setMessage('O envio da foto é obrigatório!', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('criador', this.userInfo.email);
    formData.append('idmov', this.registerForm.value.idmov || '');
    formData.append('numero_contrato', this.registerForm.value.numero_contrato || '');

    const fileToSend = this.compressedFile || this.uploadedFile!;
    formData.append('foto_contrato', fileToSend, fileToSend.name);

    this._equipamentService.register(formData)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe({
        next: (res) => {
          this.loadInitial();
          this.setMessage(res.message, 'success');
          this.isRegisterOpen = false;

          this.registerForm.reset({
            idmov: '',
            numero_contrato: '',
          });
        },
        error: (err) => {
          this.setMessage(err.error.message, 'error');
          console.error('Erro ao atualizar contrato: ', err);
        }
      });
  }

  // ========== REGISTRAR CONTRATO ========== //
  onActive(): void {
    this.isProcessing = true;

    const request = {
      idmov: this.activeForm.value.idmov,
      numero_contrato: this.activeForm.value.numero_contrato,
      ordem_compra: this.activeForm.value.ordem_compra
    }

    this._equipamentService.active(request)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe({
        next: (res) => {
          this.loadInitial();
          this.isActiveOpen = false;
          this.setMessage(res.message, 'success');
          this.activeForm.reset({
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

  // ========== RENOVAR CONTRATO ========== //
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

  // ========== DEVOLVER CONTRATO ========== //
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
            idmov: '',
            numero_contrato: ''
          });
        },
        error: (err) => {
          this.setMessage(err.error.message, 'error');
          console.error('Erro ao atualizar contrato: ', err);
        }
      });
  }

  // ========== BUSCAR HISTÓRICO DO CONTRATO ========== //
  onHistory(numeroContrato?: number): void {

    const numero_contrato = this.historyForm.value.numero_contrato || numeroContrato

    this._equipamentService.findByContract(numero_contrato)
      .subscribe({
        next: (res) => {
          this.isHistory = true;
          this.isHistoryOpen = false;

          this.rawItems = res.result;
          this.groupItems = [...this.rawItems];
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

  // ========== RETORNAR AO MENU ========== //
  returnMenu(): void {
    this.isArchiveOpen = false;
    this.isActiveOpen = false;
    this.isHistoryOpen = false;
    this.isRenewOpen = false;
    this.isRegisterOpen = false;
    this.isMenuOpen = true;
  }

  // ========== ABRIR MODAL ========== //
  openActive(): void {
    this.isMenuOpen = false;
    this.isActiveOpen = true;
  }

  // ========== ABRIR MODAL ========== //
  openRegister(): void {
    this.isMenuOpen = false;
    this.isRegisterOpen = true;
    this.getUser();
  }

  // ========== ABRIR MODAL ========== //
  openRenew(): void {
    this.isMenuOpen = false;
    this.isRenewOpen = true;
  }

  // ========== ABRIR MODAL ========== //
  openArchive(): void {
    this.isMenuOpen = false;
    this.isArchiveOpen = true;
  }

  // ========== ABRIR MODAL ========== //
  openHistory(): void {
    this.isMenuOpen = false;
    this.isHistoryOpen = true;
  }

  showHistory(item: any): void {
    this.onHistory(item.numero_contrato);
  }

  // ========== FECHAR MODAL ========== //
  closeModal(): void {
    this.isMenuOpen = false;
    this.isActiveOpen = false;
    this.isRenewOpen = false;
    this.isArchiveOpen = false;
    this.isHistoryOpen = false;
    this.isRegisterOpen = false;
    this.isHistory = false;

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

  // ===== CAPTURAR E COMPRIMIR IMAGEM ===== //
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadedFile = input.files[0];

      // Comprimir a imagem automaticamente
      this.compressImage(this.uploadedFile)
        .then(compressedFile => {
          this.compressedFile = compressedFile;
          console.log(`Imagem comprimida: ${(this.uploadedFile!.size / 1024).toFixed(0)}KB -> ${(compressedFile.size / 1024).toFixed(0)}KB`);
        })
        .catch(error => {
          console.error('Erro ao comprimir imagem:', error);
          // Em caso de erro na compressão, usa a imagem original
          this.compressedFile = null;
        });
    }
  }

  // ===== FUNÇÃO SIMPLES DE COMPRESSÃO DE IMAGEM ===== //
  private compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Arquivo não é uma imagem'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcula as novas dimensões mantendo a proporção
        let { width, height } = this.calculateNewDimensions(img.width, img.height);

        // Define o tamanho do canvas
        canvas.width = width;
        canvas.height = height;

        // Desenha a imagem redimensionada no canvas
        ctx!.drawImage(img, 0, 0, width, height);

        // Converte para JPEG com qualidade baixa
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '_compressed.jpg'),
                {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                }
              );
              resolve(compressedFile);
            } else {
              reject(new Error('Erro ao comprimir imagem'));
            }
          },
          'image/jpeg',
          this.QUALITY
        );
      };

      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // ===== CALCULAR NOVAS DIMENSÕES ===== //
  private calculateNewDimensions(originalWidth: number, originalHeight: number): { width: number, height: number } {
    let width = originalWidth;
    let height = originalHeight;

    // Redimensiona se exceder os limites máximos
    if (width > this.MAX_WIDTH) {
      height = (height * this.MAX_WIDTH) / width;
      width = this.MAX_WIDTH;
    }

    if (height > this.MAX_HEIGHT) {
      width = (width * this.MAX_HEIGHT) / height;
      height = this.MAX_HEIGHT;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }
}

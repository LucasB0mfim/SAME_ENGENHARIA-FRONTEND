import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormControl } from '@angular/forms';

import { TitleService } from '../../../../core/services/title.service';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { EquipmentRentalService } from '../../../../core/services/equipment-rental.service';
import { HttpResponse } from '@angular/common/http';
import saveAs from 'file-saver';

interface status {
  'NOVO': number;
  'ATIVO': number;
  'VENCIDO': number;
  'DEVOLVIDO': number;
}

type statusKey = keyof status;

@Component({
  selector: 'app-rental',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './rental.component.html',
  styleUrl: './rental.component.scss'
})
export class RentalComponent implements OnInit {
  private _titleService = inject(TitleService);
  private _userService = inject(DashboardService);
  private _equipamentService = inject(EquipmentRentalService);

  registerForm: FormGroup = new FormGroup({
    numero_contrato: new FormControl('', [Validators.required, Validators.minLength(4)]),
    idmov: new FormControl('', [Validators.required, Validators.min(10000)])
  });

  activeForm: FormGroup = new FormGroup({
    locacao_id: new FormControl('', [Validators.required, Validators.min(10000)]),
    ordem_compra: new FormControl('', [Validators.required, Validators.min(1000)]),
  });

  renewForm: FormGroup = new FormGroup({
    locacao_id: new FormControl('', [Validators.required, Validators.min(10000)]),
    idmov_atual: new FormControl('', [Validators.required, Validators.min(10000)]),
    idmov_novo: new FormControl('', [Validators.required, Validators.min(10000)]),
    ordem_compra: new FormControl('', [Validators.required, Validators.min(1000)]),
  });

  archiveForm: FormGroup = new FormGroup({
    produto_id: new FormControl('', [Validators.required, Validators.min(10000)]),
    data_final: new FormControl('', Validators.required),
  });

  items: any[] = [];
  filteredItem: any[] = [];
  selectedItem: any = [];

  userInfo: any = null;
  costCenters: any = null;

  selectedStatus: statusKey = 'ATIVO';
  status: status = { 'NOVO': 0, 'ATIVO': 0, 'VENCIDO': 0, 'DEVOLVIDO': 0 };

  isEmpty: boolean = false;
  isLoading: boolean = false;
  isProcessing: boolean = false;

  isMenuOpen: boolean = false;
  isRegisterOpen: boolean = false;
  isActiveOpen: boolean = false;
  isRenewOpen: boolean = false;
  isArchiveOpen: boolean = false;

  uploadedFile: File | null = null;
  compressedFile: File | null = null;

  costCenter: string = 'GERAL';

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  isBodyVisible: boolean[] = [];

  private readonly MAX_WIDTH = 800;
  private readonly MAX_HEIGHT = 600;
  private readonly QUALITY = 0.3;

  ngOnInit(): void {
    this.loadInitial();
    this._titleService.setTitle('Locação');
  }

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

          this.items = res[1]?.result || [];
          this.filteredItem = [...this.items];

          // this.costCenters = [...new Set(this.items.map((item) => item.contrato_base.centro_custo))];
          this.isEmpty = this.items.length === 0;

          this.applyFilters();
        },
        error: (err) => {
          this.isEmpty = true;
          console.error('Não foi possível buscar os contratos:', err);
        }
      });
  }

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
          this.items = res.result || [];
          this.filteredItem = [...this.items];
          this.status[statusKey] = this.items.length;
          this.isEmpty = this.items.length === 0;
        },
        error: (err) => {
          this.isEmpty = true;
          console.error('Erro ao buscar contratos:', err);
          this.setMessage('Erro ao buscar contratos!', 'error');
        }
      });
  }

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

  updateCountersAndCurrentList(): void {
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

          const currentStatusIndex = statusList.indexOf(this.selectedStatus);
          this.items = res[currentStatusIndex]?.result || [];
          this.filteredItem = [...this.items];

          // this.costCenters = [...new Set(this.items.map((item) => item.contrato_base.centro_custo))];
          this.isEmpty = this.items.length === 0;

          this.applyFilters();
        },
        error: (err) => {
          this.isEmpty = true;
          console.error('Não foi possível buscar os contratos:', err);
        }
      });
  }


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
          this.isRegisterOpen = false;
          this.updateCountersAndCurrentList();
          this.setMessage(res.message, 'success');

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

  onActive(): void {
    this.isProcessing = true;

    const request = {
      locacao_id: this.activeForm.value.locacao_id,
      ordem_compra: this.activeForm.value.ordem_compra
    }

    this._equipamentService.active(request)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe({
        next: (res) => {
          this.isActiveOpen = false;
          this.updateCountersAndCurrentList();
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

  onRenew(): void {
    this.isProcessing = true;

    const request = {
      locacao_id: this.renewForm.value.locacao_id,
      idmov_atual: this.renewForm.value.idmov_atual,
      idmov_novo: this.renewForm.value.idmov_novo,
      ordem_compra: this.renewForm.value.ordem_compra,
    }

    this._equipamentService.renew(request)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe({
        next: (res) => {
          this.isRenewOpen = false;
          this.updateCountersAndCurrentList();
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

    const request = {
      produto_id: this.archiveForm.value.produto_id,
      data_final: this.archiveForm.value.data_final
    }

    this._equipamentService.archive(request)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe({
        next: (res) => {
          this.isArchiveOpen = false;
          this.updateCountersAndCurrentList();
          this.setMessage(res.message, 'success');
          this.archiveForm.patchValue({ data_final: '' });
        },
        error: (err) => {
          this.setMessage(err.error.message, 'error');
          console.error('Erro ao atualizar contrato: ', err);
        }
      });
  }

  onHistory(): void {
    this.isProcessing = true;

    const numero_contrato = this.selectedItem.numero_contrato;

    this._equipamentService.findByContract(numero_contrato)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe({
        next: (res) => {
          this.items = res.result;
          this.isMenuOpen = false;
          this.setMessage(res.message, 'success');
        },
        error: (err) => {
          this.setMessage(err.error.message, 'error');
          console.error('Erro ao atualizar contrato: ', err);
        }
      });
  }

  downloadSheet() {
    this.isProcessing = true;

    this._equipamentService.donwloadSheet()
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe((response: HttpResponse<Blob>) => {
        const cd = response.headers.get('content-disposition');
        const fileName = cd?.match(/filename="?([^"]+)"?/)?.[1] || 'REGISTRO_DE_LOCAÇÕES.xlsx';
        saveAs(response.body!, fileName);
      });
  }


  openMenu(item: any): void {
    this.selectedItem = item;
    this.isMenuOpen = true;
    console.log(item)
  }

  returnMenu(): void {
    this.isActiveOpen = false;
    this.isRenewOpen = false;
    this.isRegisterOpen = false;
    this.isArchiveOpen = false;
    this.isMenuOpen = true;
  }

  openRegister(): void {
    this.isMenuOpen = false;
    this.isRegisterOpen = true;
    this.getUser();
  }

  openActive(): void {
    this.isMenuOpen = false;
    this.isActiveOpen = true;

    this.activeForm.patchValue({
      locacao_id: this.selectedItem.locacao_id,
    })
  }

  openRenew(): void {
    this.isMenuOpen = false;
    this.isRenewOpen = true;

    this.renewForm.patchValue({
      locacao_id: this.selectedItem.locacao_id,
      idmov_atual: this.selectedItem.idmov,
    });
  }

  openArchive(): void {
    this.isMenuOpen = false;
    this.isArchiveOpen = true;

    this.archiveForm.patchValue({
      produto_id: this.selectedItem.produto_id
    });
  }

  closeModal(): void {
    this.isMenuOpen = false;
    this.isActiveOpen = false;
    this.isRenewOpen = false;
    this.isRegisterOpen = false;
    this.isArchiveOpen = false;
  }


  applyFilters() {
    let data = [...this.filteredItem];

    if (this.costCenter && this.costCenter !== 'GERAL') {
      const inputValue = this.costCenter;
      data = data.filter(item =>
        item.contrato_base.centro_custo && item.contrato_base.centro_custo.includes(inputValue)
      );
    }

    this.items = data;
    this.isEmpty = this.items.length === 0;
  }

  setMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  }


  formateDate(date: string): string {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  upperCase(string: string): string {
    return string.trim().toUpperCase();
  }


  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadedFile = input.files[0];

      this.compressImage(this.uploadedFile)
        .then(compressedFile => {
          this.compressedFile = compressedFile;
          console.log(`Imagem comprimida: ${(this.uploadedFile!.size / 1024).toFixed(0)}KB -> ${(compressedFile.size / 1024).toFixed(0)}KB`);
        })
        .catch(error => {
          console.error('Erro ao comprimir imagem:', error);
          this.compressedFile = null;
        });
    }
  }

  compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Arquivo não é uma imagem'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = this.calculateNewDimensions(img.width, img.height);

        canvas.width = width;
        canvas.height = height;

        ctx!.drawImage(img, 0, 0, width, height);

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

  calculateNewDimensions(originalWidth: number, originalHeight: number): { width: number, height: number } {
    let width = originalWidth;
    let height = originalHeight;

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

  toggleBodyVisibility(index: number): void {
    this.isBodyVisible[index] = !this.isBodyVisible[index];
  }
}

import saveAs from 'file-saver';
import { finalize } from 'rxjs';

import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormsModule, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';

import { TitleService } from '../../../../core/services/title.service';
import { TransportService } from '../../../../core/services/transport.service';

@Component({
  selector: 'app-disciplinary-measure',
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './transport.component.html',
  styleUrl: './transport.component.scss'
})
export class TransportComponent implements OnInit {
  private readonly _titleService = inject(TitleService);
  private readonly _transportService = inject(TransportService);

  updateForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl(''),
    status: new FormControl('', Validators.required),
    observacao: new FormControl('', Validators.required),
  });

  items: any[] = [];
  currentItem: any = {};
  filteredItems: any[] = [];

  employee: string = '';
  activeStatus: string = '';

  menuModalOpen: boolean = false;
  updateModalOpen: boolean = false;

  isEmpty: boolean = false;
  isLoading: boolean = false;
  isSearching: boolean = false;

  isUpdating: boolean = false;
  isDownloading: boolean = false;

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this.findByStatus('NOVO');
    this._titleService.setTitle('Vale Transporte');
  }

  findByStatus(status: string): void {
    this.items = [];
    this.isEmpty = false;
    this.isSearching = true;

    this._transportService.findByStatus(status)
      .pipe(finalize(() => this.isSearching = false))
      .subscribe({
        next: (res) => {
          this.items = res.result;
          this.filteredItems = [...this.items];
          this.isEmpty = this.items.length === 0;
          this.activeStatus = status;
        },
        error: (err) => {
          console.error(err.error.message, err);
        }
      });
  };

  update(): void {
    this.isLoading = true;

    const request = {
      id: this.currentItem.id,
      status: this.updateForm.value.status,
      observacao: this.updateForm.value.observacao
    }

    this._transportService.update(request)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.resetUpdateForm();
          this.updateModalOpen = false;
          this.findByStatus(this.activeStatus);
          this.setMessage(res.message, 'success');
        },
        error: (err) => {
          console.log(err.error.message);
          this.setMessage(err.error.message, 'error');
        }
      });
  };

  applyFilters() {
    let data = [...this.filteredItems];

    if (this.employee) {
      const inputValue = this.employee
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      data = data.filter(item => {
        if (!item.colaborador) return false;

        const colaborador = item.colaborador
          .toUpperCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        return colaborador.includes(inputValue);
      });
    }

    this.items = data;
  };

  openMenu(item: any): void {
    this.menuModalOpen = true;
    this.currentItem = item;
    console.log(this.currentItem)
  };

  closeModals(): void {
    this.menuModalOpen = false;
    this.updateModalOpen = false;
  };

  openUpdateModal(): void {
    this.menuModalOpen = false;
    this.updateModalOpen = true;

    this.updateForm.patchValue({
      id: this.currentItem.id,
      nome: this.currentItem.nome,
      status: this.currentItem.status,
      observacao: this.currentItem.observacao,
    });
  }

  returnModal(): void {
    this.menuModalOpen = true;
    this.updateModalOpen = false;
  }

  formateDate(date: string) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  setMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  };

  setBorderColor(tipo: string): string {
    switch (tipo) {
      case 'SOLICITACAO': return '#28a745';
      case 'CANCELAMENTO': return '#dc3545';
      case 'ALTERACAO': return '#007bff';
      default: return '#FF6F00';
    }
  };

  download() {
    this.isDownloading = true;
    this._transportService.download(this.currentItem.id)
      .pipe(finalize(() => this.isDownloading = false))
      .subscribe((response: HttpResponse<Blob>) => {
        const cd = response.headers.get('content-disposition');
        const fileName = cd?.match(/filename="?([^"]+)"?/)?.[1] || 'VALE_TRANSPORTE.pdf';
        saveAs(response.body!, fileName);
      });
  }

  resetUpdateForm(): void {
    this.updateForm.reset({
      id: '',
      nome: '',
      status: '',
      observacao: ''
    })
  }
}

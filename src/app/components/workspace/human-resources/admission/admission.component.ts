import saveAs from 'file-saver';
import { finalize } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormsModule, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';

import { TitleService } from '../../../../core/services/title.service';
import { AdmissionService } from '../../../../core/services/admission.service';

import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-admission',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './admission.component.html',
  styleUrl: './admission.component.scss'
})
export class AdmissionComponent implements OnInit {

  private readonly _titleService = inject(TitleService);
  private readonly _admissionService = inject(AdmissionService);

  updateForm: FormGroup = new FormGroup({
    id: new FormControl(''),
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

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this.findByStatus('NOVO');
    this._titleService.setTitle('Admissão');
  }

  findByStatus(status: string): void {
    this.items = [];
    this.isEmpty = false;
    this.isSearching = true;

    this._admissionService.findByStatus(status)
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

    this._admissionService.update(request)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
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
        if (!item.nome) return false;

        const nome = item.nome
          .toUpperCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        return nome.includes(inputValue);
      });
    }

    this.items = data;
  };

  openMenu(item: any): void {
    this.menuModalOpen = true;
    this.currentItem = item;
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
      status: this.currentItem.status,
      observacao: this.currentItem.observacao
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

  formatePhone(phone: string): string {
    if (!phone) return 'N/A';
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  };

  openClipboard(url: string): void {
    window.open(`https://sameengenharia.com.br/api/admission/file/${url}`, "_blank", "noopener,noreferrer");
  };

  download() {
    this.isLoading = true;
    this._admissionService.download(this.currentItem.id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((response: HttpResponse<Blob>) => {
        const cd = response.headers.get('content-disposition');
        const fileName = cd?.match(/filename="?([^"]+)"?/)?.[1] || 'RELATORIO_DE_ADMISSAO.pdf';
        saveAs(response.body!, fileName);
      });
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
}

import saveAs from 'file-saver';
import { finalize } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { TitleService } from '../../../../core/services/title.service';
import { AdmissionService } from '../../services/admission.service';

import { AdmissionItem, AdmissionCountStatus, MessageType } from '../../interfaces/admission.interface';

@Component({
  selector: 'app-admission',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admission.component.html',
  styleUrl: './admission.component.scss',
})
export class AdmissionComponent implements OnInit {

  private readonly _titleService    = inject(TitleService);
  private readonly _admissionService = inject(AdmissionService);

  updateForm: FormGroup = new FormGroup({
    id:          new FormControl(''),
    status:      new FormControl('', Validators.required),
    dataAdmissao: new FormControl('', Validators.required),
    observacao:  new FormControl('', Validators.required),
  });

  items: AdmissionItem[]         = [];
  filteredItems: AdmissionItem[] = [];
  currentItem: AdmissionItem     = {} as AdmissionItem;

  countStatus: AdmissionCountStatus = {
    novo: 0, andamento: 0, concluido: 0, cancelado: 0,
  };

  employee:     string = '';
  activeStatus: string = '';

  menuModalOpen:   boolean = false;
  updateModalOpen: boolean = false;
  rGModalOpen:     boolean = false;

  isEmpty:     boolean = false;
  isLoading:   boolean = false;
  isSearching: boolean = false;

  message:     string      = '';
  showMessage: boolean     = false;
  messageType: MessageType = 'success';

  ngOnInit(): void {
    this._titleService.setTitle('Admissão');
    this.findByStatus('NOVO');
    this.countByStatus();
  }

  findByStatus(status: string): void {
    this.items       = [];
    this.isEmpty     = false;
    this.isSearching = true;

    this._admissionService.findByStatus(status)
      .pipe(finalize(() => (this.isSearching = false)))
      .subscribe({
        next: (res) => {
          this.items         = res.result;
          this.filteredItems = [...this.items];
          this.isEmpty       = this.items.length === 0;
          this.activeStatus  = status;
        },
        error: (err) => console.error(err.error.message, err),
      });
  }

  countByStatus(): void {
    this._admissionService.countByStatus().subscribe({
      next:  (res) => (this.countStatus = res.result),
      error: (err) => console.error(err),
    });
  }

  update(): void {
    this.isLoading = true;

    const request = {
      id:           this.currentItem.id,
      status:       this.updateForm.value.status,
      data_admissao: this.updateForm.value.dataAdmissao,
      observacao:   this.updateForm.value.observacao,
    };

    this._admissionService.update(request)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          this.updateModalOpen = false;
          this.findByStatus(this.activeStatus);
          this.setMessage(res.message, 'success');
        },
        error: (err) => this.setMessage(err.error.message, 'error'),
      });
  }

  delete(): void {
    this._admissionService.delete(this.currentItem.id)
      .pipe(finalize(() => !this.isLoading))
      .subscribe({
        next: (res) => {
          this.menuModalOpen = false;
          this.findByStatus(this.activeStatus);
          this.setMessage(res.message, 'success');
        },
        error: (err) => this.setMessage(err.error.message, 'error'),
      });
  }

  applyFilters(): void {
    if (!this.employee) {
      this.items = [...this.filteredItems];
      return;
    }

    const query = this.employee
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    this.items = this.filteredItems.filter((item) => {
      if (!item.nome) return false;
      const nome = item.nome.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return nome.includes(query);
    });
  }

  openMenu(item: AdmissionItem): void {
    this.menuModalOpen = true;
    this.currentItem   = item;
  }

  openRGModal(item: AdmissionItem): void {
    this.rGModalOpen = true;
    this.currentItem  = item;
  }

  closeModals(): void {
    this.menuModalOpen   = false;
    this.updateModalOpen = false;
    this.rGModalOpen     = false;
  }

  openUpdateModal(): void {
    this.menuModalOpen   = false;
    this.updateModalOpen = true;
    this.updateForm.patchValue({
      id:          this.currentItem.id,
      status:      this.currentItem.status,
      observacao:  this.currentItem.observacao,
    });
  }

  returnModal(): void {
    this.menuModalOpen   = true;
    this.updateModalOpen = false;
  }

  formateDate(date: string | null): string {
    if (!date) return 'N/A';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  formatePhone(phone: string | null): string {
    if (!phone) return 'N/A';
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  }

  openClipboard(url: string | null): void {
    if (!url) return;
    window.open(`https://sameengenharia.com.br/api/admission/file/${url}`, '_blank', 'noopener,noreferrer');
  }

  openRGFront(): void {
    this.openClipboard(this.currentItem.foto_rg_frente);
  }

  openRGBack(): void {
    this.openClipboard(this.currentItem.foto_rg_verso);
  }

  download(): void {
    alert('Em manutenção. Em caso de necessidade entre em contato.');
  }

  excel(): void {
    this.isLoading = true;
    this._admissionService.excel()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response: HttpResponse<Blob>) => {
        const cd       = response.headers.get('content-disposition');
        const fileName = cd?.match(/filename="?([^"]+)"?/)?.[1] || 'BSCASH.xlsx';
        saveAs(response.body!, fileName);
      });
  }

  getLink(): void {
    this.isLoading = true;
    this._admissionService.generateLink()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          navigator.clipboard.writeText(res.result);
          this.setMessage(res.message, 'success');
        },
        error: (err) => this.setMessage(err.error.message, 'error'),
      });
  }

  setMessage(message: string, type: MessageType = 'success'): void {
    this.message     = message;
    this.messageType = type;
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
      this.message     = '';
    }, 3000);
  }
}

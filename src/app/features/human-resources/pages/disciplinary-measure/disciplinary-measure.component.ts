import saveAs from 'file-saver';
import { finalize } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { TitleService } from '../../../../core/services/title.service';
import { DisciplinaryMeasureService } from '../../services/disciplinary-measure.service';

import { DisciplinaryMeasureItem, DisciplinaryMeasureCountStatus, MessageType } from '../../interfaces/disciplinary-measure.interface';

@Component({
  selector: 'app-disciplinary-measure',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './disciplinary-measure.component.html',
  styleUrl: './disciplinary-measure.component.scss',
})
export class DisciplinaryMeasureComponent implements OnInit {

  private readonly _titleService               = inject(TitleService);
  private readonly _disciplinaryMeasureService = inject(DisciplinaryMeasureService);

  updateForm: FormGroup = new FormGroup({
    id:          new FormControl(''),
    criador:     new FormControl(''),
    status:      new FormControl('', Validators.required),
    advertencia: new FormControl('', Validators.required),
    observacao:  new FormControl('', Validators.required),
  });

  items: DisciplinaryMeasureItem[]         = [];
  filteredItems: DisciplinaryMeasureItem[] = [];
  currentItem: DisciplinaryMeasureItem     = {} as DisciplinaryMeasureItem;

  countStatus: DisciplinaryMeasureCountStatus = {
    novo: 0, andamento: 0, concluido: 0, cancelado: 0,
  };

  employee:     string = '';
  activeStatus: string = '';

  menuModalOpen:   boolean = false;
  updateModalOpen: boolean = false;

  isEmpty:     boolean = false;
  isLoading:   boolean = false;
  isSearching: boolean = false;

  message:     string      = '';
  showMessage: boolean     = false;
  messageType: MessageType = 'success';

  ngOnInit(): void {
    this._titleService.setTitle('Medidas Disciplinares');
    this.findByStatus('NOVO');
    this.countByStatus();
  }

  findByStatus(status: string): void {
    this.items       = [];
    this.isEmpty     = false;
    this.isSearching = true;

    this._disciplinaryMeasureService.findByStatus(status)
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
    this._disciplinaryMeasureService.countByStatus().subscribe({
      next:  (res) => (this.countStatus = res.result),
      error: (err) => console.error(err),
    });
  }

  update(): void {
    this.isLoading = true;

    const request = {
      id:          this.currentItem.id,
      status:      this.updateForm.value.status,
      advertencia: this.updateForm.value.advertencia,
      observacao:  this.updateForm.value.observacao,
    };

    this._disciplinaryMeasureService.update(request)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          this.resetUpdateForm();
          this.updateModalOpen = false;
          this.findByStatus(this.activeStatus);
          this.setMessage(res.message, 'success');
        },
        error: (err) => this.setMessage(err.error.message, 'error'),
      });
  }

  delete(): void {
    this._disciplinaryMeasureService.delete(this.currentItem.id)
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

  openMenu(item: DisciplinaryMeasureItem): void {
    this.menuModalOpen = true;
    this.currentItem   = item;
  }

  closeModals(): void {
    this.menuModalOpen   = false;
    this.updateModalOpen = false;
  }

  openUpdateModal(): void {
    this.menuModalOpen   = false;
    this.updateModalOpen = true;
    this.updateForm.patchValue({
      id:          this.currentItem.id,
      criador:     this.currentItem.criado_por,
      status:      this.currentItem.status,
      advertencia: this.currentItem.advertencia,
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

  download(): void {
    this.isLoading = true;
    this._disciplinaryMeasureService.download(this.currentItem.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response: HttpResponse<Blob>) => {
        const cd       = response.headers.get('content-disposition');
        const fileName = cd?.match(/filename="?([^"]+)"?/)?.[1] || 'MEDIDA_DISCIPLINAR.pdf';
        saveAs(response.body!, fileName);
      });
  }

  resetUpdateForm(): void {
    this.updateForm.reset({
      criador:     '',
      status:      '',
      advertencia: '',
      observacao:  '',
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

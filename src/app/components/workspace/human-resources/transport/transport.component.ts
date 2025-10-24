import { finalize } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../../core/services/title.service';
import { TransportService } from '../../../../core/services/transport.service';

@Component({
  selector: 'app-transport',
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss']
})
export class TransportComponent implements OnInit {

  private readonly _titleService = inject(TitleService);
  private readonly _transportService = inject(TransportService);

  updateForm: FormGroup = new FormGroup({
    status: new FormControl('', Validators.required),
  });

  items: any[] = [];
  currentItem: any = {};

  activeStatus: string = '';

  isEmpty: boolean = false;
  isLoading: boolean = false;
  isSearching: boolean = false;

  modalOpen: boolean = false;

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
          this.isEmpty = this.items.length === 0;
          this.activeStatus = status;
        },
        error: (err) => {
          console.error(err.error.message, err);
        }
      });
  };

  formateDate(date: string) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  setBorderColor(tipo: string): string {
    switch (tipo) {
      case 'SOLICITACAO': return '#28a745';
      case 'CANCELAMENTO': return '#dc3545';
      case 'ALTERACAO': return '#007bff';
      default: return '#FF6F00';
    }
  };

  openModal(item: any): void {
    this.modalOpen = true;
    this.currentItem = item;
  };

  closeModal(): void {
    this.modalOpen = false;
  };

  update(): void {
    this.isLoading = true;

    const request = {
      id: this.currentItem.id,
      status: this.updateForm.value.status
    }

    this._transportService.update(request)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.modalOpen = false;
          this.findByStatus(this.activeStatus);
        },
        error: (err) => {
          console.log(err.error.message);
        }
      });
  };
}

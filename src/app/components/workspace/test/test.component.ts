import { finalize, tap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { EquipmentRentalService } from '../../../core/services/equipment-rental.service';

@Component({
  selector: 'app-test',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {
  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private _equipamentService = inject(EquipmentRentalService);

  // ========== ESTADOS ========== //
  items: any[] = [];

  isFind: boolean = false;
  isEmpty: boolean = false;
  isLoading: boolean = true;

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  // ========== HOOK ========== //
  ngOnInit(): void {
    this.getEquipment();
    this._titleService.setTitle('Locação');
  }

  getEquipment(): void {
    this._equipamentService.findAll().pipe(finalize(() => this.isLoading = false)).subscribe({
      next: (res) => {
        this.items = res.result;
      }
    });
  }

  // ========== AUXILIARES ========== //
  formateDate(date: string): string {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
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
}

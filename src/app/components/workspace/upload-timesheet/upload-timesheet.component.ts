import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize, catchError, of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Component, ViewChild, ElementRef, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../core/services/title.service';
import { TimesheetService } from '../../../core/services/timesheet.service';

@Component({
  selector: 'app-upload-timesheet',
  standalone: true,
  imports: [FormsModule, CommonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './upload-timesheet.component.html',
  styleUrl: './upload-timesheet.component.scss'
})
export class UploadTimesheetComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private readonly _timesheetService = inject(TimesheetService);

  // ========== ESTADOOS ========== //
  readonly acceptedFileTypes: string = '.csv';
  readonly maxFileSize: number = 5 * 1024 * 1024; // 5MB

  file: File | null = null;

  isLoading: boolean = false;

  isTimesheet: boolean = true;
  isExtraDay: boolean = false;

  errorMessage: string = '';
  successMessage: string = '';
  showError: boolean = false;
  showSuccess: boolean = false;

  showMessage: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  // ========== HOOK ========== //
  ngOnInit(): void {
    this._titleService.setTitle('Folha de ponto');
  }

  // ========== API ========== //
  submitTimesheet(): void {

    if (!this.file) {
      this.setMessage('Selecione um arquivo para enviar', 'error');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('folha_ponto', this.file, this.file.name);

    this._timesheetService.upload(formData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError(error => {
          console.error(error);
          this.setMessage('Erro ao enviar o arquivo. Tente novamente.', 'error');
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.setMessage('Timesheet enviado com sucesso!', 'success');
          this.resetFileInput();
        }
      });
  }

  submitExtraDay(): void {

    if (!this.file) {
      this.setMessage('Selecione um arquivo para enviar', 'error');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('folha_ponto', this.file, this.file.name);

    this._timesheetService.uploadExtraDay(formData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError(error => {
          console.error(error);
          this.setMessage('Erro ao enviar o arquivo. Tente novamente.', 'error');
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.setMessage('Timesheet enviado com sucesso!', 'success');
          this.resetFileInput();
        }
      });
  }

  // ========== TROCAR TELA ========== //
  onChangeTimesheet(): void {
    this.isExtraDay = false;
    this.isTimesheet = true;

    this._titleService.setTitle('Folha de ponto');
  }

  onChangeExtraDay(): void {
    this.isTimesheet = false;
    this.isExtraDay = true;

    this._titleService.setTitle('Dia extra');
  }

  // ========== MENSAGENS ========== //
  setMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  }

  // ========== MÉTODOS AUXILIARES ========== //
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (!this.validateFile(file)) {
      this.resetFileInput();
      return;
    }

    this.file = file;
  }

  validateFile(file: File): boolean {
    if (!file.name.endsWith('.csv')) {
      this.setMessage('Apenas arquivos CSV são aceitos', 'error');
      return false;
    }

    if (file.size > this.maxFileSize) {
      this.setMessage('O arquivo excede o tamanho máximo de 5MB', 'error');
      return false;
    }

    return true;
  }

  resetFileInput(): void {
    this.fileInput.nativeElement.value = '';
    this.file = null;
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files?.length) {
      const file = files[0]
      if (this.validateFile(file)) {
        this.file = file;
      }
    }
  }
}

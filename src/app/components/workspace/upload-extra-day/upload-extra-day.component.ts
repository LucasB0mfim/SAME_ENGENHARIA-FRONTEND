import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize, catchError, of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Component, ViewChild, ElementRef, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../core/services/title.service';
import { TimesheetService } from '../../../core/services/timesheet.service';

@Component({
  selector: 'app-upload-extra-day',
  imports: [
    FormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './upload-extra-day.component.html',
  styleUrl: './upload-extra-day.component.scss'
})
export class UploadExtraDayComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  loading: boolean = false;
  file: File | null = null;
  readonly acceptedFileTypes: string = '.csv';
  readonly maxFileSize: number = 5 * 1024 * 1024; // 5MB

  private _title = inject(TitleService);
  private readonly _timesheetService = inject(TimesheetService);

  errorMessage: string = '';
  successMessage: string = '';
  showError: boolean = false;
  showSuccess: boolean = false;

  ngOnInit(): void {
    this._title.setTitle('Importar Dia Extra');
  }

  /**
   * Processa o arquivo selecionado pelo usuário
   * @param event Evento de mudança do input de arquivo
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.clearMessages();

    if (!this.validateFile(file)) {
      this.resetFileInput();
      return;
    }

    this.file = file;
  }

  /**
   * Valida o tipo e tamanho do arquivo
   * @param file Arquivo para validação
   * @returns Boolean indicando se o arquivo é válido
   */
  private validateFile(file: File): boolean {
    if (!file.name.endsWith('.csv')) {
      this.setErrorMessage('Apenas arquivos CSV são aceitos');
      return false;
    }

    if (file.size > this.maxFileSize) {
      this.setErrorMessage('O arquivo excede o tamanho máximo de 5MB');
      return false;
    }

    return true;
  }

  /**
   * Define mensagem de erro e ativa sua exibição
   * @param message Mensagem a ser exibida
   */
  private setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    this.showSuccess = false;

    // Auto-ocultar mensagem após 5 segundos
    setTimeout(() => {
      this.showError = false;
    }, 5000);
  }

  /**
   * Define mensagem de sucesso e ativa sua exibição
   * @param message Mensagem a ser exibida
   */
  private setSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
    this.showError = false;

    // Auto-ocultar mensagem após 3 segundos
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  /**
   * Limpa todas as mensagens
   */
  private clearMessages(): void {
    this.showError = false;
    this.showSuccess = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Limpa o input de arquivo
   */
  private resetFileInput(): void {
    this.fileInput.nativeElement.value = '';
    this.file = null;
  }

  /**
   * Simula o clique no input de arquivo
   */
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  /**
   * Envia o arquivo para processamento
   */
  submitTimesheet(): void {
    if (!this.file) {
      this.setErrorMessage('Selecione um arquivo para enviar');
      return;
    }

    this.loading = true;
    this.clearMessages();

    // Criar FormData e anexar o arquivo
    const formData = new FormData();
    formData.append('folha_ponto', this.file, this.file.name);

    // Enviar o arquivo para o serviço
    this._timesheetService.uploadExtraDay(formData)
      .pipe(
        // Finalizar o loading independentemente do resultado
        finalize(() => {
          this.loading = false;
        }),
        // Capturar e tratar erros
        catchError(error => {
          // Personalizar mensagem de erro com base no código de erro da API (se disponível)
          const errorMessage = error.error?.message || 'Erro ao enviar o arquivo. Tente novamente.';
          this.setErrorMessage(errorMessage);
          return of(null);
        })
      )
      .subscribe(response => {
        // Verificar se houve resposta (catchError retorna null em caso de erro)
        if (response) {
          this.setSuccessMessage('Timesheet enviado com sucesso!');
          this.resetFileInput();
        }
      });
  }

  /**
   * Lida com o evento de arrastar e soltar arquivos
   * @param event Evento de arrastar e soltar
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Processa o arquivo solto na área de upload
   * @param event Evento de soltar arquivo
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files?.length) {
      const file = files[0];
      this.clearMessages();
      if (this.validateFile(file)) {
        this.file = file;
      }
    }
  }
}

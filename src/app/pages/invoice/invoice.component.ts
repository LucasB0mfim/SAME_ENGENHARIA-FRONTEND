import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask'
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ToastComponent } from "../../shared/toast/toast.component";
import { InvoiceService } from '../../core/services/invoice.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    NgxCurrencyDirective,
    NgxMaskDirective,
    ToastComponent
  ],
  providers: [provideNgxMask()],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
})
export class InvoiceComponent {
  @ViewChild('arquivo_url') fileInput!: ElementRef;

  invoiceForm: FormGroup;
  selectedFile: File | null = null;
  isSending: boolean = false;
  toast: { type: string, message: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService
  ) {
    this.invoiceForm = this.fb.group({
      nome_completo: [''],
      cnpj: [''],
      data_periodo: [''],
      data_vencimento: [''],
      valor: [''],
      linha_digitavel: [''],
      pix_payload: [''],
    });
  }

  // Aciona o clique no input de arquivo oculto
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.showFeedback('error', 'Por favor, selecione um arquivo PDF.');
      return;
    }

    this.isSending = true;

    const formData = new FormData();
    formData.append('nome_completo', this.invoiceForm.get('nome_completo')?.value);
    formData.append('cnpj', this.invoiceForm.get('cnpj')?.value);
    formData.append('data_periodo', this.invoiceForm.get('data_periodo')?.value);
    formData.append('data_vencimento', this.invoiceForm.get('data_vencimento')?.value);
    formData.append('valor', this.invoiceForm.get('valor')?.value);
    formData.append('linha_digitavel', this.invoiceForm.get('linha_digitavel')?.value);
    formData.append('pix_payload', this.invoiceForm.get('pix_payload')?.value);
    formData.append('arquivo_url', this.selectedFile, this.selectedFile.name);

    this.invoiceService.create(formData)
      .pipe(finalize(() => this.isSending = false))
      .subscribe({
        next: (res) => {
          // this.invoiceForm.reset();
          // this.selectedFile = null;
          this.showFeedback('success', 'Nota Fiscal cadastrada com sucesso!');
        },
        error: (err) => {
          console.error(err.error.message, err);
          this.showFeedback('error', 'Erro ao enviar a nota. Tente novamente.');
        }
      });
  }

  showFeedback(type: string, message: string) {
    this.toast = { type, message };
  }
}

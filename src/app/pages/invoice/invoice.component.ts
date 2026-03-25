import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { InvoiceService } from '../../core/services/invoice.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
})
export class InvoiceComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  invoiceForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService
  ) {
    this.invoiceForm = this.fb.group({
      numero_nota: [''],
      data_emissao: [''],
      data_vencimento: [''],
      valor: [''],
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
    const formData = new FormData();

    formData.append('numero_nota', this.invoiceForm.get('numero_nota')?.value);
    formData.append('data_emissao', this.invoiceForm.get('data_emissao')?.value);
    formData.append('data_vencimento', this.invoiceForm.get('data_vencimento')?.value);
    formData.append('valor', this.invoiceForm.get('valor')?.value);

    if (this.selectedFile) {
      formData.append('arquivo_nota', this.selectedFile, this.selectedFile.name);
    }

    this.invoiceService.create(formData).subscribe({
      next: (res) => {
        console.log('Nota criada com sucesso!', res)
      },
      error: (err) => {
        console.error('Erro ao enviar', err)
      }
    });
  }
}

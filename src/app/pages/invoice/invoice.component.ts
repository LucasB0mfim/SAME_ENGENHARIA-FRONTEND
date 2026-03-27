import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ToastComponent } from "../../shared/toast/toast.component";
import { InvoiceService } from '../../core/services/invoice.service';
import { EmployeeService } from '../../features/human-resources/services/employee.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    ToastComponent
  ],
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
    private invoiceService: InvoiceService,
    private employeeService: EmployeeService
  ) {
    this.invoiceForm = this.fb.group({
      chapa: [''],
      mes_medicao: [''],
      data_vencimento: [''],
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
    formData.append('mes_medicao', this.invoiceForm.get('mes_medicao')?.value);
    formData.append('data_vencimento', this.invoiceForm.get('data_vencimento')?.value);
    formData.append('arquivo_url', this.selectedFile, this.selectedFile.name);

    this.invoiceService.create(formData)
      .pipe(finalize(() => this.isSending = false))
      .subscribe({
        next: (res) => {
          this.invoiceForm.reset();
          this.selectedFile = null;
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

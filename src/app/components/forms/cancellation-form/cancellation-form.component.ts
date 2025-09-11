import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdmissionService } from '../../../core/services/admission.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancellation-form',
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective, MatProgressSpinnerModule],
  providers: [provideNgxMask()],
  templateUrl: './cancellation-form.component.html',
  styleUrl: './cancellation-form.component.scss'
})
export class CancellationFormComponent {

  // ========== INJEÇÃO DE DEPENDENCIAS ========== //
  private readonly _admissionService = inject(AdmissionService);
  private _router = inject(Router);

  // ========== ESTADOS ========== //
  isLoading: boolean = false;
  uploadedFiles: { [key: string]: File } = {};

  // ========== FORMULÁRIO ========== //
  createForm: FormGroup = new FormGroup({
    cpf: new FormControl('', Validators.required),
    endereco: new FormControl('', Validators.required),
    beneficio: new FormControl('', Validators.required),
    motivo: new FormControl('', Validators.required),
    termos: new FormControl('', Validators.requiredTrue),
  })

  // ========== DEFINIR ERRO ========== //
  hasError(fieldName: string): boolean {
    const field = this.createForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // ========== MENSAGEM DE CAMPO INVÁLIDO ========== //
  getErrorMessage(fieldName: string): string {
    const field = this.createForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
    }
    return '';
  }

  // ========== API ========== //
  onSubmit(): void {

    const request = {
      cpf: this.createForm.value.cpf,
      endereco: this.createForm.value.endereco,
      beneficio: this.createForm.value.beneficio,
      motivo: this.createForm.value.motivo
    }

    console.log(request);
  }

}

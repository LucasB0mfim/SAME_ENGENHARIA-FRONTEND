import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdmissionService } from '../../../core/services/admission.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admission-form',
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective, MatProgressSpinnerModule],
  providers: [provideNgxMask()],
  templateUrl: './admission-form.component.html',
  styleUrl: './admission-form.component.scss'
})
export class AdmissionFormComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDENCIAS ========== //
  private readonly _admissionService = inject(AdmissionService);
  private _router = inject(Router);

  // ========== ESTADOS ========== //
  isLoading: boolean = false;
  uploadedFiles: { [key: string]: File } = {};

  // ========== FORMULÁRIO ========== //
  createForm: FormGroup = new FormGroup({
    nome: new FormControl('', Validators.required),
    cpf: new FormControl('', Validators.required),
    data_nascimento: new FormControl('', Validators.required),
    numero_contato: new FormControl('', Validators.required),
    rg: new FormControl('', Validators.required),
    pis: new FormControl(''),
    endereco: new FormControl('', Validators.required),

    // Dados profissionais
    funcao: new FormControl('', Validators.required),
    tamanho_farda: new FormControl('', Validators.required),
    numero_calcado: new FormControl('', Validators.required),
    criancas_dependentes: new FormControl('', Validators.required),
    precisa_vt: new FormControl(''),
    quantidade_vt: new FormControl(''),
    possui_vem: new FormControl(''),
    numero_vem: new FormControl(''),

    // Redes sociais
    instagram: new FormControl(''),
    linkedin: new FormControl(''),

    // Dados médicos
    tipo_sanguineo: new FormControl('', Validators.required),
    alergia: new FormControl('', Validators.required),
    doenca_cronica: new FormControl('', Validators.required),

    // Contato de emergência
    contato_emergencia_nome: new FormControl('', Validators.required),
    grau_parentesco_emergencia: new FormControl('', Validators.required),
    numero_contato_emergencia: new FormControl('', Validators.required),
  });

  // ========== HOOK ========== //
  ngOnInit(): void {
    // Observar mudanças no campo "Precisa de vale transporte"
    this.createForm.get('precisa_vt')?.valueChanges.subscribe(value => {
      this.updateValeTransporteValidations(value);
    });

    // Observar mudanças no campo "Possui Cartão VEM"
    this.createForm.get('possui_vem')?.valueChanges.subscribe(value => {
      this.updateCartaoVEMValidations(value);
    });
  }

  updateValeTransporteValidations(precisaValeTransporte: string): void {
    const quantidadeVTControl = this.createForm.get('quantidade_vt');
    const possuiCartaoVEMControl = this.createForm.get('possui_vem');

    if (precisaValeTransporte === 'SIM') {
      quantidadeVTControl?.setValidators([Validators.required]);
      possuiCartaoVEMControl?.setValidators([Validators.required]);
    } else {
      quantidadeVTControl?.clearValidators();
      possuiCartaoVEMControl?.clearValidators();
      quantidadeVTControl?.setValue('');
      possuiCartaoVEMControl?.setValue('');

      // Limpar também os campos dependentes do cartão VEM
      this.updateCartaoVEMValidations('');
    }

    quantidadeVTControl?.updateValueAndValidity();
    possuiCartaoVEMControl?.updateValueAndValidity();
  }

  updateCartaoVEMValidations(possuiCartaoVEM: string): void {
    const numeroCartaoVEMControl = this.createForm.get('numero_vem');
    const fotoCartaoVEMControl = this.createForm.get('foto_vem');

    if (possuiCartaoVEM === 'SIM') {
      numeroCartaoVEMControl?.setValidators([Validators.required]);
      fotoCartaoVEMControl?.setValidators([Validators.required]);
    } else {
      numeroCartaoVEMControl?.clearValidators();
      fotoCartaoVEMControl?.clearValidators();
      numeroCartaoVEMControl?.setValue('');
      fotoCartaoVEMControl?.setValue(null);
    }

    numeroCartaoVEMControl?.updateValueAndValidity();
    fotoCartaoVEMControl?.updateValueAndValidity();
  }

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
    if (this.createForm.invalid) return;

    const requiredFiles = [
      'foto_3x4',
      'foto_cpf',
      'foto_rg_frente',
      'foto_rg_verso',
      'foto_certidao',
      'foto_comprovante_residencia'
    ];

    const missingFiles = requiredFiles.filter(field => !this.uploadedFiles[field]);

    if (missingFiles.length > 0) {
      alert('Por favor, envie a imagem de todos os documentos.');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();

    Object.entries(this.createForm.value).forEach(([key, value]) => {
      formData.append(key, value != null ? String(value) : '');
    });

    Object.entries(this.uploadedFiles).forEach(([key, file]) => {
      formData.append(key, file, file.name);
    });

    this._admissionService.create(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this._router.navigate(['/success-form']);
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
        this._router.navigate(['/error-form']);
      }
    });
  }

  // ========== MANIPULAR IMAGEM ========== //
  onFileChange(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFiles[field] = input.files[0];
    }
  }
}

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { AdmissionService } from '../../../core/services/admission.service';

@Component({
  selector: 'app-admission-form',
  imports: [NgxMaskDirective, MatIconModule, CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  providers: [provideNgxMask()],
  templateUrl: './admission-form.component.html',
  styleUrl: './admission-form.component.scss'
})
export class AdmissionFormComponent {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private readonly _admission = inject(AdmissionService);

  // ========== FORMULÁRIO ========== //
  admissionForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    cpf: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
    birthDate: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
    rg: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(9)]),
    pis: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
    address: new FormControl('', Validators.required),
    uniform: new FormControl('', Validators.required),
    dailyVouchers: new FormControl(''),
    role: new FormControl('', Validators.required),
    bootSize: new FormControl(''),
    childrenUnder14: new FormControl('', Validators.required),
    instagram: new FormControl(''),
    linkedin: new FormControl(''),
    bloodType: new FormControl('', Validators.required),
    emergencyName: new FormControl('', Validators.required),
    relationship: new FormControl('', Validators.required),
    emergencyPhone: new FormControl('', Validators.required),
    allergy: new FormControl('', Validators.required),
    chronicDisease: new FormControl('', Validators.required),
    photo3x4: new FormControl('', Validators.required),
    cpfImage: new FormControl('', Validators.required),
    rgFront: new FormControl('', Validators.required),
    rgBack: new FormControl('', Validators.required),
    certificate: new FormControl('', Validators.required),
    residenceProof: new FormControl('', Validators.required)
  });

  // ========== ESTADOS ==========
  showForm: boolean = true;

  error: boolean = false;
  success: boolean = false;

  isLoading: boolean = false;

  useVT: string = '';

  fileNames: { [key: string]: string } = {};

  showError: boolean = false;
  errorMessage: string = '';

  needBoot: string[] = [
    'PINTOR',
    'SERVENTE',
    'PEDREIRO',
    'ARMADOR',
    'SOLDADOR',
    'BETONEIRO',
    'ELETRICISTA',
    'ALMOXARIFE',
    'ENGENHEIRO',
    'ENCANADOR',
    'SERRALHEIRO',
    'CARPINTEIRO',
    'ENCARREGADO',
    'APONTADOR',
    'MESTRE DE OBRAS',
    'AUXILIAR DE ENGENHARIA',
    'TÉCNICO DE SEGURANÇA',
    'TÉCNICO EM EDIFICAÇÕES',
    'OPERADOR DE MÁQUINAS',
    'MOTORISTA DE CAMINHÃO',
  ];

  // ========== UTILITÁRIOS ========== //
  onManageVT(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.useVT = selectElement.value;
  }

  // ========== MENSAGEM PARA PREENCHER TODOS OS CAMPOS ========== //
  setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showError = true;

    setTimeout(() => {
      this.showError = false;
    }, 3000);
  }

  // ========== API ========== //
  onFileSelected(campo: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.fileNames[campo] = file?.name || 'Selecione uma imagem';
    this.admissionForm.get(campo)?.setValue(file);
  }

  sendForm(): void {

    if (this.admissionForm.invalid) {
      this.admissionForm.markAllAsTouched();
      this.setErrorMessage('Preencha todos os campos!');
      return;
    }

    this.error = false;
    this.showForm = false;
    this.isLoading = true;

    const formData = new FormData();

    Object.keys(this.admissionForm.controls).forEach((key) => {
      const control = this.admissionForm.get(key);
      const value = control?.value;

      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else {
        formData.append(key, value ?? '');
      }
    });

    this._admission.sendForm(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.success = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.error = true;
        console.error('Erro ao enviar formulário.', error)
      }
    });
  }
}

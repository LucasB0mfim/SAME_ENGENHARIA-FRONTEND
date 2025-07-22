import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdmissionService } from '../../../core/services/admission.service';

@Component({
  selector: 'app-admission-form',
  imports: [NgxMaskDirective, MatIconModule, CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  providers: [provideNgxMask()],
  templateUrl: './admission-form.component.html',
  styleUrl: './admission-form.component.scss'
})
export class AdmissionFormComponent {
  private readonly _admission = inject(AdmissionService);

  admissionForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    rg: new FormControl('', [Validators.required]),
    pis: new FormControl(''),
    address: new FormControl('', [Validators.required]),
    uniform: new FormControl('', [Validators.required]),
    dailyVouchers: new FormControl(''),
    role: new FormControl('', [Validators.required]),
    bootSize: new FormControl(''),
    childrenUnder14: new FormControl('', [Validators.required]),
    instagram: new FormControl(''),
    linkedin: new FormControl(''),
    bloodType: new FormControl('', [Validators.required]),
    emergencyName: new FormControl('', [Validators.required]),
    relationship: new FormControl('', [Validators.required]),
    emergencyPhone: new FormControl('', [Validators.required]),
    allergy: new FormControl('', [Validators.required]),
    chronicDisease: new FormControl('', [Validators.required]),
    photo3x4: new FormControl(null, [Validators.required]),
    cpfImage: new FormControl(null, [Validators.required]),
    rgFront: new FormControl(null, [Validators.required]),
    rgBack: new FormControl(null, [Validators.required]),
    certificate: new FormControl(null, [Validators.required]),
    residenceProof: new FormControl(null, [Validators.required])
  });

  showForm: boolean = true;
  error: boolean = false;
  success: boolean = false;
  isLoading: boolean = false;
  useVT: string = '';
  fileNames: { [key: string]: string } = {};
  showError: boolean = false;
  errorMessage: string = '';

  needBoot: string[] = [
    'PINTOR', 'SERVENTE', 'PEDREIRO', 'ARMADOR', 'SOLDADOR', 'BETONEIRO',
    'ELETRICISTA', 'ALMOXARIFE', 'ENGENHEIRO', 'ENCANADOR', 'SERRALHEIRO',
    'CARPINTEIRO', 'ENCARREGADO', 'APONTADOR', 'MESTRE DE OBRAS',
    'AUXILIAR DE ENGENHARIA', 'TÉCNICO DE SEGURANÇA', 'TÉCNICO EM EDIFICAÇÕES',
    'OPERADOR DE MÁQUINAS', 'MOTORISTA DE CAMINHÃO'
  ];

  onManageVT(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.useVT = selectElement.value;
    this.admissionForm.get('dailyVouchers')?.setValidators(
      this.useVT === 'SIM' ? [Validators.required] : []
    );
    this.admissionForm.get('dailyVouchers')?.updateValueAndValidity();
  }

  setErrorMessage(message: string): void {
    this.showError = true;
    this.errorMessage = message;
    setTimeout(() => {
      this.showError = false;
      this.errorMessage = '';
    }, 3000);
  }

  onFileSelected(field: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    console.log(`Arquivo selecionado para ${field}:`, file);
    if (file) {
      this.fileNames[field] = file.name;
      this.admissionForm.get(field)?.setValue(file);
    } else {
      this.fileNames[field] = 'Selecione uma imagem';
      this.admissionForm.get(field)?.setValue(null);
    }
  }

  sendForm(): void {

    if (this.admissionForm.invalid) {
      console.log('Campos inválidos:', this.admissionForm.controls);
      Object.keys(this.admissionForm.controls).forEach(key => {
        const control = this.admissionForm.get(key);
        if (control?.invalid) {
          console.log(`Campo ${key} inválido:`, control.errors);
        }
      });
      this.admissionForm.markAllAsTouched();
      this.setErrorMessage('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    this.isLoading = true;
    this.showForm = false;
    this.error = false;
    this.success = false;

    const formData = new FormData();
    const formValue = this.admissionForm.value;

    Object.entries(formValue).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });

    formData.append('useVT', this.useVT);

    this._admission.sendForm(formData).subscribe({
      next: () => {
        this.success = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro no envio:', error);
        this.isLoading = false;
        this.error = true;
        this.showForm = true;
        this.setErrorMessage('Erro ao enviar o formulário. Tente novamente!');
      }
    });
  }
}

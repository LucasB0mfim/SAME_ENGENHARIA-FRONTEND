import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AdmissionService } from '../../../../core/services/admission.service';

interface FormField {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  options?: string[];
  accept?: string;
  min?: number;
  max?: number;
  mask?: string;
  placeholder?: string;
  validators?: any[];
}

interface FormSection {
  title: string;
  icon: string;
  fields: FormField[];
  formGroupName: string;
}

enum SubmissionState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {

  admissionForm!: FormGroup;
  currentSection = 0;
  submissionState: SubmissionState = SubmissionState.IDLE;
  errorMessage = '';
  uploadedFiles: { [key: string]: string } = {};

  sections: FormSection[] = [
    {
      title: 'Dados Pessoais',
      icon: 'person',
      formGroupName: 'dadosPessoais',
      fields: [
        {
          label: 'Nome Completo',
          name: 'nome',
          type: 'text',
          required: true,
          placeholder: 'Digite seu nome completo',
          validators: [Validators.minLength(3)]
        },
        {
          label: 'CPF',
          name: 'cpf',
          type: 'text',
          mask: '000.000.000-00',
          required: true,
          placeholder: '000.000.000-00'
        },
        {
          label: 'RG',
          name: 'rg',
          type: 'text',
          required: true,
          placeholder: 'Digite seu RG'
        },
        {
          label: 'Data de Nascimento',
          name: 'data_nascimento',
          type: 'date',
          required: true
        },
        {
          label: 'Sexo',
          name: 'sexo',
          type: 'select',
          options: ['MASCULINO', 'FEMININO'],
          required: true
        },
        {
          label: 'Nome da Mãe',
          name: 'nome_mae',
          type: 'text',
          required: true,
          placeholder: 'Digite o nome completo da mãe'
        },
        {
          label: 'PIS',
          name: 'pis',
          type: 'number',
          placeholder: '000.00000.00-0'
        }
      ]
    },
    {
      title: 'Contato',
      icon: 'phone',
      formGroupName: 'contato',
      fields: [
        {
          label: 'Email',
          name: 'email',
          type: 'email',
          required: true,
          placeholder: 'email@exemplo.com',
          validators: [Validators.email]
        },
        {
          label: 'Número de Contato',
          name: 'numero_contato',
          type: 'tel',
          mask: '(00) 00000-0000',
          required: true,
          placeholder: '(00) 00000-0000'
        },
        {
          label: 'Endereço Completo',
          name: 'endereco',
          type: 'textarea',
          required: true,
          placeholder: 'Rua, número, bairro, cidade - UF'
        }
      ]
    },
    {
      title: 'Profissional',
      icon: 'work',
      formGroupName: 'profissional',
      fields: [
        {
          label: 'Função',
          name: 'funcao',
          type: 'text',
          required: true,
          placeholder: 'Digite sua função'
        },
        {
          label: 'Tamanho da Farda',
          name: 'tamanho_farda',
          type: 'select',
          options: ['PP', 'P', 'M', 'G', 'GG', 'XG'],
          required: true
        },
        {
          label: 'Número do Calçado',
          name: 'numero_calcado',
          type: 'number',
          required: true,
          min: 30,
          placeholder: 'Ex: 38'
        }
      ]
    },
    {
      title: 'Saúde',
      icon: 'favorite',
      formGroupName: 'informacoesSaude',
      fields: [
        {
          label: 'Tipo Sanguíneo',
          name: 'tipo_sanguineo',
          type: 'select',
          options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
          required: true
        },
        {
          label: 'Alergia',
          name: 'alergia',
          type: 'textarea',
          placeholder: 'Descreva suas alergias (se houver)'
        },
        {
          label: 'Doença Crônica',
          name: 'doenca_cronica',
          type: 'textarea',
          placeholder: 'Descreva doenças crônicas (se houver)'
        }
      ]
    },
    {
      title: 'Emergência',
      icon: 'emergency',
      formGroupName: 'emergencia',
      fields: [
        {
          label: 'Nome do Contato de Emergência',
          name: 'contato_emergencia_nome',
          type: 'text',
          required: true,
          placeholder: 'Nome completo do contato'
        },
        {
          label: 'Parentesco',
          name: 'grau_parentesco_emergencia',
          type: 'select',
          options: ['PAI', 'MAE', 'FILHO', 'FILHA', 'IRMAO', 'IRMA', 'TIO', 'TIA', 'PRIMO', 'PRIMA', 'COMPANHEIRO', 'COMPANHEIRA', 'OUTRO'],
          required: true
        },
        {
          label: 'Número de Emergência',
          name: 'numero_contato_emergencia',
          type: 'tel',
          mask: '(00) 00000-0000',
          required: true,
          placeholder: '(00) 00000-0000'
        }
      ]
    },
    {
      title: 'Outros',
      icon: 'home',
      formGroupName: 'outros',
      fields: [
        {
          label: 'Quantidade de Filhos',
          name: 'criancas_dependentes',
          type: 'number',
          min: 0,
          placeholder: '0'
        }
      ]
    },
    {
      title: 'Vale Transporte',
      icon: 'directions_bus',
      formGroupName: 'valeTransporte',
      fields: [
        {
          label: 'Quantas passagens de ÔNIBUS você precisa por dia? (Opcional)',
          name: 'qtd_onibus',
          type: 'number',
          required: false,
          min: 0,
          placeholder: '0'
        },
        {
          label: 'Quantas passagens de METRÔ você precisa por dia? (Opcional)',
          name: 'qtd_metro',
          type: 'number',
          required: false,
          min: 0,
          placeholder: '0'
        },
        {
          label: 'Número do cartão VEM (Opcional)',
          name: 'vem',
          type: 'text',
          required: false,
          mask: '00.00.00000000-0',
          placeholder: '00.00.00000000-0'
        }
      ]
    },
    {
      title: 'Documentos',
      icon: 'upload_file',
      formGroupName: 'documentos',
      fields: [
        {
          label: 'Foto 3x4',
          name: 'foto_3x4',
          type: 'file',
          accept: 'image/*',
          required: true
        },
        {
          label: 'Foto CPF',
          name: 'foto_cpf',
          type: 'file',
          accept: 'image/*',
          required: true
        },
        {
          label: 'Foto RG Frente',
          name: 'foto_rg_frente',
          type: 'file',
          accept: 'image/*',
          required: true
        },
        {
          label: 'Foto RG Verso',
          name: 'foto_rg_verso',
          type: 'file',
          accept: 'image/*',
          required: true
        },
        {
          label: 'Certidão de Nascimento',
          name: 'foto_certidao',
          type: 'file',
          accept: 'image/*'
        },
        {
          label: 'Comprovante de Residência',
          name: 'foto_comprovante_residencia',
          type: 'file',
          accept: 'image/*',
          required: true
        },
        {
          label: 'Cartão VEM (se tiver)',
          name: 'foto_vem',
          type: 'file',
          accept: 'image/*',
          required: false
        }
      ]
    },
  ];

  constructor(
    private fb: FormBuilder,
    private _admissionService: AdmissionService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const formConfig: any = {};

    this.sections.forEach(section => {
      const sectionConfig: any = {};

      section.fields.forEach(field => {
        const validators = [];

        if (field.required) {
          validators.push(Validators.required);
        }

        if (field.validators) {
          validators.push(...field.validators);
        }

        if (field.min !== undefined && field.type === 'number') {
          validators.push(Validators.min(field.min));
        }

        sectionConfig[field.name] = ['', validators];
      });

      formConfig[section.formGroupName] = this.fb.group(sectionConfig);
    });

    this.admissionForm = this.fb.group(formConfig);
  }

  getCurrentSectionGroup(): FormGroup {
    return this.admissionForm.get(this.sections[this.currentSection].formGroupName) as FormGroup;
  }

  getFieldControl(fieldName: string): AbstractControl | null {
    return this.getCurrentSectionGroup().get(fieldName);
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.getFieldControl(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(fieldName: string): string {
    const control = this.getFieldControl(fieldName);

    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo é obrigatório';
    if (control.errors['email']) return 'Email inválido';
    if (control.errors['minlength']) return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['min']) return `Valor mínimo: ${control.errors['min'].min}`;

    return 'Campo inválido';
  }

  handleFileChange(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadedFiles[fieldName] = file.name;
      this.getFieldControl(fieldName)?.setValue(file);
      this.getFieldControl(fieldName)?.markAsTouched();
    }
  }

  removeFile(fieldName: string): void {
    delete this.uploadedFiles[fieldName];
    this.getFieldControl(fieldName)?.setValue('');

    // Limpa o input file
    const fileInput = document.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  nextSection(): void {
    const currentGroup = this.getCurrentSectionGroup();

    // Marca todos os campos como touched para mostrar erros
    Object.keys(currentGroup.controls).forEach(key => {
      currentGroup.get(key)?.markAsTouched();
    });

    // Verifica se há campos obrigatórios inválidos
    const requiredFields = this.sections[this.currentSection].fields.filter(f => f.required);
    const hasInvalidRequired = requiredFields.some(field => {
      const control = this.getFieldControl(field.name);
      return control && control.invalid;
    });

    if (hasInvalidRequired) {
      return; // Não avança se houver campos obrigatórios inválidos
    }

    if (this.currentSection < this.sections.length - 1) {
      this.currentSection++;
      this.scrollToTop();
    }
  }

  prevSection(): void {
    if (this.currentSection > 0) {
      this.currentSection--;
      this.scrollToTop();
    }
  }

  goToSection(index: number): void {
    if (index < this.currentSection) {
      this.currentSection = index;
      this.scrollToTop();
    }
  }

  async handleSubmit(): Promise<void> {
    // Marca todos os campos como touched
    Object.keys(this.admissionForm.controls).forEach(groupKey => {
      const group = this.admissionForm.get(groupKey) as FormGroup;
      Object.keys(group.controls).forEach(key => {
        group.get(key)?.markAsTouched();
      });
    });

    if (this.admissionForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      this.submissionState = SubmissionState.ERROR;
      setTimeout(() => {
        this.submissionState = SubmissionState.IDLE;
      }, 5000);
      return;
    }

    this.submissionState = SubmissionState.LOADING;

    try {
      // Preparar dados para envio
      const formData = this.prepareFormData();

      // Descomentar quando o service estiver disponível
      await this._admissionService.create(formData).toPromise();

      // Simular chamada API (remover em produção)
      await this.simulateApiCall(formData);

      this.submissionState = SubmissionState.SUCCESS;
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      this.errorMessage = 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.';
      this.submissionState = SubmissionState.ERROR;
    }
  }

  private prepareFormData(): FormData {
    const formData = new FormData();

    this.sections.forEach(section => {
      const group = this.admissionForm.get(section.formGroupName) as FormGroup;

      section.fields.forEach(field => {
        const value = group.get(field.name)?.value;

        if (value) {
          if (field.type === 'file') {
            formData.append(field.name, value);
          } else {
            formData.append(field.name, value.toString());
          }
        }
      });
    });

    return formData;
  }

  private async simulateApiCall(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Dados do formulário:', data);
        // Simula sucesso (95% de chance)
        Math.random() > 0.05 ? resolve() : reject(new Error('Erro simulado'));
      }, 2000);
    });
  }

  closeMessage(): void {
    this.submissionState = SubmissionState.IDLE;
  }

  getProgressPercentage(): number {
    return ((this.currentSection + 1) / this.sections.length) * 100;
  }

  isFieldWide(field: FormField): boolean {
    return field.type === 'textarea' || field.type === 'file';
  }

  isSectionCompleted(index: number): boolean {
    if (index >= this.currentSection) return false;

    const section = this.sections[index];
    const group = this.admissionForm.get(section.formGroupName) as FormGroup;

    const requiredFields = section.fields.filter(f => f.required);
    return requiredFields.every(field => {
      const control = group.get(field.name);
      return control && control.valid && control.value;
    });
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get SubmissionState() {
    return SubmissionState;
  }
}

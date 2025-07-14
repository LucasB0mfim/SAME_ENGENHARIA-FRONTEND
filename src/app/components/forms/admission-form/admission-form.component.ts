import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admission-form',
  imports: [NgxMaskDirective, MatIconModule, CommonModule, ReactiveFormsModule],
  providers: [provideNgxMask()],
  templateUrl: './admission-form.component.html',
  styleUrl: './admission-form.component.scss'
})
export class AdmissionFormComponent {

  // ========== ESTADOS ==========
  useVT: string = '';
  useBoot: string = '';
  hasChildren: string = '';
  hasChronicCondition: string = '';
  children: string[] = [];

  selectedFunction: string = '';
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

  hapvida: string[] = [
    'ADMINISTRATIVO',
    'ENGENHEIRO',
    'TÉCNICO DE SEGURANÇA',
    'TÉCNICO EM EDIFICAÇÕES'
  ];

  admissionForm: FormGroup = new FormGroup({
    nome: new FormControl(''),
    cpf: new FormControl(''),
    dataNascimento: new FormControl(''),
    numeroContato: new FormControl(''),
    rg: new FormControl(''),
    pis: new FormControl(''),
    endereco: new FormControl(''),
    complemento: new FormControl(''),
    cep: new FormControl(''),
    tamanhoFarda: new FormControl(''),
    usaVt: new FormControl(''),
    quantidadeVT: new FormControl(''),
    funcao: new FormControl(''),
    tamanhoBota: new FormControl(''),
    hapvida: new FormControl(''),
    possuiFilho: new FormControl(''),
    nomeFilho: new FormControl(''),
    cpfFilho: new FormControl(''),
    cpfFilhoFoto: new FormControl(''),
    certidaoNascimentoFilho: new FormControl(''),
    instagram: new FormControl(''),
    linkedin: new FormControl(''),
    tipoSanguineo: new FormControl(''),
    contatoEmergencia: new FormControl(''),
    grauParentesco: new FormControl(''),
    numeroContatoEmergencia: new FormControl(''),
    contatoEmergenciaSecundario: new FormControl(''),
    grauParentescoSecundario: new FormControl(''),
    numeroContatoEmergenciaSecundario: new FormControl(''),
    alergia: new FormControl(''),
    condicaoMedica: new FormControl(''),
    tipoCondicaoMedica: new FormControl(''),
    foto3x4: new FormControl(''),
    cpfFoto: new FormControl(''),
    rgFrente: new FormControl(''),
    rgVerso: new FormControl(''),
    certidaoNascimento: new FormControl(''),
    comproventeResidencia: new FormControl('')
  })

  // ========== UTILITÁRIOS ==========
  onManageVT(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.useVT = selectElement.value;
  }

  onManageChildren(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.hasChildren = selectElement.value;
  }

  onManageBoot(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.useBoot = selectElement.value;
  }

  onManageChronicCondition(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.hasChronicCondition = selectElement.value;
  }

  onFuncaoChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedFunction = target.value;
  }

  addChildren(): void {
    this.children.push('');
  }

  updateChildren(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.children[index] = target.value;
  }

  removeChildren(index: number): void {
    this.children.splice(index, 1);
  }
}

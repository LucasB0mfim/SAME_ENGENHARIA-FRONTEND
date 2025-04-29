import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../core/services/title.service';
import { ExperienceService } from '../../../core/services/experience.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-work-modality',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './work-modality.component.html',
  styleUrl: './work-modality.component.scss'
})
export class WorkModalityComponent implements OnInit {

  // INJEÇÃO DE DEPÊNCIAS
  private _titleService = inject(TitleService);
  private readonly _experienceService = inject(ExperienceService);

  // VARIÁVEL PARA ARMAZENAR OS DADOS DA API
  item: any[] = [];

  // VARIÁVEL PARA LISTA VAZIA
  isEmpty: boolean = false;

  // VARIÁVEL PARA CARREGAMENTO
  isLoading: boolean = true;

  // MENSAGEM DE SUCESSO
  errorMessage: string = '';
  showError: boolean = false;

  // MENSAGEM DE ERRO
  successMessage: string = '';
  showSuccess: boolean = false;

  // ARMAZENA FORMULÁRIO POR CHAPA
  form: { [key: string]: FormGroup } = {};

  // FORMULÁRIO DE ENVIO //

  modalityForm(employee: any): FormGroup {
    if (!this.form[employee.chapa]) {
      this.form[employee.chapa] = new FormGroup({
        viajar: new FormControl(employee.viajar || 'N/A'),
        segmento: new FormControl(employee.segmento || 'N/A')
      });
    }
    return this.form[employee.chapa];
  }


  // HOOK DE CICLO //

  ngOnInit() {
    this._titleService.setTitle('Definir Modalidade de Trabalho');
    this.getEmployees();
  }

  // BUSCAR FUNCIONÁRIOS //

  getEmployees() {
    this._experienceService.find().subscribe({
      next: (data) => {
        this.item = data.records.filter(item => item.funcao === 'SERVENTE' || item.funcao === 'PEDREIRO');
        this.isLoading = false;
        this.isEmpty = this.item.length === 0;
      },
      error: (error) => {
        this.isEmpty = true;
        this.isLoading = false;
        console.error('Falha ao buscar dados dos funcionários: ', error);
      }
    })
  }

  // ATUALIZAR MODALIDADE DO COLABORADOR //

  updateModality(employee: any) {    
    const form = this.modalityForm(employee);

    const request = {
      chapa: employee.chapa,
      viajar: form.value.viajar,
      segmento: form.value.segmento
    }

    this._experienceService.updateModality(request).subscribe({
      next: () => {
        this.getEmployees();
        this.setSuccessMessage('Colaborador atualizado com sucesso.')
      },
      error: (error) => {
        this.setErrorMessage('Não foi possível atualizar o colaborador.');
        console.error('Falha ao atualizar modalidade do colaborador: ', error);
      }
    })
  }

  // DEFINIR MENSAGEM DE SUCESSO //

  setSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
    this.showError = false;

    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  // DEFINIR MENSAGEM DE ERRO //

  setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    this.showSuccess = false;

    setTimeout(() => {
      this.showError = false;
    }, 5000);
  }
}

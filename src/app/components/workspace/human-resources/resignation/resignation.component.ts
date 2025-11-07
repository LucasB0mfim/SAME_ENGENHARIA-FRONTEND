import { finalize } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { TitleService } from '../../../../core/services/title.service';
import { ResignationService } from '../../../../core/services/resignation.service';
import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
  selector: 'app-resignation',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './resignation.component.html',
  styleUrl: './resignation.component.scss'
})
export class ResignationComponent implements OnInit {

  private readonly _titleService = inject(TitleService);
  private readonly _resignationService = inject(ResignationService);
  private readonly _employeesService = inject(EmployeeService);

  createForm: FormGroup = new FormGroup({
    nome: new FormControl('', Validators.required),
    modalidade: new FormControl('', Validators.required),
    comunicarColaborador: new FormControl('', Validators.required),
    observacao: new FormControl('', Validators.required)
  });

  updateForm: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    modalidade: new FormControl('', Validators.required),
    dataInicioAvisoTrabalhado: new FormControl(null, Validators.required),
    modalidadeAvisoTrabalhado: new FormControl('', Validators.required),
    colaboradorComunicado: new FormControl('', Validators.required),
    dataRescisao: new FormControl(null, Validators.required)
  });

  items: any[] = [];
  currentItem: any = {};
  filteredItems: any[] = [];
  activeEmployees: any = {};

  employee: string = '';
  activeStatus: string = '';

  menuModalOpen: boolean = false;
  createModalOpen: boolean = false;
  updateModalOpen: boolean = false;

  isEmpty: boolean = false;
  isLoading: boolean = false;
  isSearching: boolean = false;

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this.findByStatus('NOVO');
    this._titleService.setTitle('Desligamento');
  }

  findByStatus(status: string): void {
    this.items = [];
    this.isEmpty = false;
    this.isSearching = true;

    this._resignationService.findByStatus(status)
      .pipe(finalize(() => this.isSearching = false))
      .subscribe({
        next: (res) => {
          this.items = res.result;
          this.filteredItems = [...this.items];
          this.isEmpty = this.items.length === 0;
          this.activeStatus = status;
        },
        error: (err) => {
          console.error(err.error.message, err);
        }
      });
  };

  findActiveEmployees(): void {
    this._employeesService.findActiveNames()
    .subscribe({
      next: (res) => {
        this.activeEmployees = res.result;
      },
      error: (err) => {
        this.setMessage(err.error.message, 'error')
      }
    });
  }

  create(): void {
    this.isLoading = true;

    const request = {
      nome: this.createForm.value.nome,
      modalidade: this.createForm.value.modalidade,
      data_comunicacao: this.createForm.value.comunicarColaborador,
      observacao: this.createForm.value.observacao,
    }

    this._resignationService.create(request)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.createModalOpen = false;
          this.findByStatus(this.activeStatus);
          this.setMessage(res.message, 'success');
        },
        error: (err) => {
          console.log(err.error.message);
          this.setMessage(err.error.message, 'error');
        }
      });
  };

  update(): void {
    this.isLoading = true;

    const request = {
      id: this.updateForm.value.id,
      status: this.updateForm.value.status,
      modalidade: this.updateForm.value.modalidade,
      data_inicio_aviso_trabalhado: this.updateForm.value.dataInicioAvisoTrabalhado,
      modalidade_aviso_trabalhado: this.updateForm.value.modalidadeAvisoTrabalhado,
      colaborador_comunicado: this.updateForm.value.colaboradorComunicado,
      data_comunicacao: this.currentItem.data_comunicacao,
      data_rescisao: this.updateForm.value.dataRescisao
    }

    this._resignationService.update(request)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.updateModalOpen = false;
          this.findByStatus(this.activeStatus);
          this.setMessage(res.message, 'success');
        },
        error: (err) => {
          console.log(err.error.message);
          this.setMessage(err.error.message, 'error');
        }
      });
  };

  applyFilters() {
    let data = [...this.filteredItems];

    if (this.employee) {
      const inputValue = this.employee
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      data = data.filter(item => {
        if (!item.nome) return false;

        const nome = item.nome
          .toUpperCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        return nome.includes(inputValue);
      });
    }

    this.items = data;
  };

  openCreator(): void {
    this.createModalOpen = true;
    this.findActiveEmployees();
  }

  openMenu(item: any): void {
    this.menuModalOpen = true;
    this.currentItem = item;
  };

  closeModals(): void {
    this.menuModalOpen = false;
    this.updateModalOpen = false;
    this.createModalOpen = false;
  };

  openUpdateModal(): void {
    this.menuModalOpen = false;
    this.updateModalOpen = true;
    this.updateForm.patchValue({
      id: this.currentItem.id,
      status: this.currentItem.status,
      modalidade: this.currentItem.modalidade,
      inicioAvisoTrabalhado: this.currentItem.data_inicio_aviso_trabalhado,
      modalidadeAvisoTrabalhado: this.currentItem.modalidade_aviso_trabalhado,
      colaboradorComunicado: this.currentItem.colaborador_comunicado,
      rescisao: this.currentItem.data_rescisao,
      observacao: this.currentItem.observacao,
    });
  }

  returnModal(): void {
    this.menuModalOpen = true;
    this.updateModalOpen = false;
  }

  formateDate(date: string) {
    if (!date) return 'N/A'
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  setMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  };
}

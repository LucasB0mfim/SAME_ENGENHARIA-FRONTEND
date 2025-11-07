import { finalize } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormsModule, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';

import { BrkService } from '../../../../core/services/brk.service';
import { TitleService } from '../../../../core/services/title.service';
import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
  selector: 'app-brk',
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './brk.component.html',
  styleUrl: './brk.component.scss'
})
export class BrkComponent implements OnInit {

  private readonly _titleService = inject(TitleService);
  private readonly _brkService = inject(BrkService);
  private readonly _employeeService = inject(EmployeeService);

  createForm: FormGroup = new FormGroup({
    nome: new FormControl('', Validators.required),
    funcao: new FormControl('', Validators.required),
    contrato: new FormControl('', Validators.required),
    centroCusto: new FormControl('', Validators.required),
    observacao: new FormControl('', Validators.required),
  });

  updateForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    funcao: new FormControl('', Validators.required),
    contrato: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    centroCusto: new FormControl('', Validators.required),
    pesquisaSocial: new FormControl('', Validators.required),
    envioDocumento: new FormControl('', Validators.required),
    reenvioDocumento: new FormControl('', Validators.required),
    aso: new FormControl('', Validators.required),
    epi: new FormControl('', Validators.required),
    treinamento: new FormControl('', Validators.required),
    os: new FormControl('', Validators.required),
    link: new FormControl('', Validators.required),
    observacao: new FormControl('', Validators.required),
  });

  items: any[] = [];
  currentItem: any = {};
  filteredItems: any[] = [];
  listOfFunctions: any = {};

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
    this._titleService.setTitle('BRK');
  };

  findByStatus(status: string): void {
    this.items = [];
    this.isEmpty = false;
    this.isSearching = true;

    this._brkService.findByStatus(status)
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

  findFunctions(): void {
    this._employeeService.findFunctions()
      .subscribe({
        next: (res) => {
          this.listOfFunctions = res.result;
        },
        error: (err) => {
          this.setMessage(err.error.message, 'error');
        }
      });
  };

  create(): void {
    this.isLoading = true;

    const request = {
      nome: this.createForm.value.nome,
      funcao: this.createForm.value.funcao,
      contrato: this.createForm.value.contrato,
      centro_custo: this.createForm.value.centroCusto,
      observacao: this.createForm.value.observacao,
    };

    this._brkService.create(request)
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
      funcao: this.updateForm.value.funcao,
      contrato: this.updateForm.value.contrato,
      status: this.updateForm.value.status,
      centro_custo: this.updateForm.value.centroCusto,
      dt_envio_pesq_social: this.updateForm.value.pesquisaSocial,
      dt_envio_doc: this.updateForm.value.envioDocumento,
      dt_reenvio_doc: this.updateForm.value.reenvioDocumento,
      aso: this.updateForm.value.aso,
      epi: this.updateForm.value.epi,
      treinamento: this.updateForm.value.treinamento,
      os: this.updateForm.value.os,
      link: this.updateForm.value.link,
      observacao: this.updateForm.value.observacao,
    };

    this._brkService.update(request)
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
    };

    this.items = data;
  };

  openMenu(item: any): void {
    this.menuModalOpen = true;
    this.currentItem = item;
  };

  openCreator(): void {
    this.createModalOpen = true;
    this.findFunctions();
  };

  closeCreator(): void {
    this.createModalOpen = false;
  };

  closeModals(): void {
    this.menuModalOpen = false;
    this.updateModalOpen = false;
    this.createModalOpen = false;
  };

  openUpdateModal(): void {
    this.menuModalOpen = false;
    this.updateModalOpen = true;
    this.findFunctions();

    this.updateForm.patchValue({
      id: this.currentItem.id,
      funcao: this.currentItem.funcao || '',
      contrato: this.currentItem.contrato || '',
      status: this.currentItem.status || '',
      centroCusto: this.currentItem.centro_custo || '',
      pesquisaSocial: this.currentItem.dt_envio_pesq_social,
      envioDocumento: this.currentItem.dt_envio_doc,
      reenvioDocumento: this.currentItem.dt_prev_aprov_reenvio_doc,
      aso: this.currentItem.aso || '',
      epi: this.currentItem.epi || '',
      treinamento: this.currentItem.treinamento || '',
      os: this.currentItem.os || '',
      link: this.currentItem.link,
      observacao: this.currentItem.observacao
    });
  };

  returnModal(): void {
    this.menuModalOpen = true;
    this.updateModalOpen = false;
  };

  formateDate(date: string): string {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  managerLink(link: string): any {
    if (!link) return 'N/A';
    window.open(`${link}`, "_blank", "noopener,noreferrer");
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

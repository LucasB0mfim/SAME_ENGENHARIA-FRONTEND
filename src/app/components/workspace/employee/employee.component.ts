import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { BenefitService } from '../../../core/services/benefit.service';

@Component({
  selector: 'app-employee',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private readonly _benefitService = inject(BenefitService);

  // ========== FORMULÁRIOS ========== //
  costCenterForm: FormGroup = new FormGroup({
    centroCusto: new FormControl('GERAL')
  })

  updateForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl(''),
    centroCusto: new FormControl('')
  })

  // ========== ESTADOS ========== //
  items: any[] = [];
  filteredItems: any[] = [];
  costCenter: any[] = [];
  costCenterUnique: String[] = [];

  employee: string = '';

  isEdit: boolean = false;
  isLoading: boolean = true;
  isUpdate: boolean = false;
  isFind: boolean = false;

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  // ========== HOOK ========== //
  ngOnInit(): void {
    this._titleService.setTitle('Efetivo');
    this.findAllCostCenter();
    this.findByCostCenter();
  }

  // ========== API ========== //
  findAllCostCenter(): void {
    this._benefitService.findAllCostCenter().subscribe({
      next: (res) => {
        this.costCenter = res.result;
        this.removeDuplicate();
      },
      error: (error) => {
        console.error('Erro ao consultar centros de custo!', error);
      }
    });
  }

  findByCostCenter(): void {
    this.items = [];
    this.isFind = true;
    this.isLoading = true;

    const request = { centro_custo: this.costCenterForm.value.centroCusto || 'GERAL' }

    this._benefitService.findByCostCenter(request).subscribe({
      next: (res) => {
        this.items = res.result;
        this.filteredItems = [...this.items];
        this.isFind = false;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao consultar centros de custo!', error);
        this.isFind = false;
        this.isLoading = false;
      }
    });
  }

  update(): void {
    this.isUpdate = true;

    const request = {
      id: this.updateForm.value.id,
      nome: this.updateForm.value.nome,
      centro_custo: this.updateForm.value.centroCusto,
    }

    this._benefitService.updateCostCenter(request).subscribe({
      next: () => {
        this.isEdit = false;
        this.findByCostCenter();
        this.isUpdate = false;
        this.employee = '';
        this.updateForm.reset({
          id: '',
          nome: '',
          centroCusto: ''
        });
        this.setMessage('Colaborador atualizado com sucesso!', 'success');
      },
      error: (error) => {
        this.isEdit = false;
        this.isUpdate = false;
        console.error('Erro ao atualizar colaborador: ', error);
        this.setMessage('Não foi possível atualizar colaborador!', 'error');
      }
    });
  }

  // ========== TROCAR ENTRE TELAS ========== //
  openModal(item: any): void {
    this.isEdit = true;

    this.updateForm.patchValue({
      id: item.id,
      nome: item.nome,
      centroCusto: item.centro_custo
    })
  }

  closeModal(): void {
    this.isEdit = false;
  }

  // ========== BUSCAR COLABORADOR ========== //
  applyFilters() {
    let data = [...this.filteredItems];

    if (this.employee) {
      const inputValue = this.employee.toUpperCase();
      data = data.filter(data =>
        data.nome.toUpperCase().includes(inputValue)
      );
    }

    this.items = data;
  }

  // ========== MENSAGEM DINAMICA ========== //
  setMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  }

  // ========== UTILITÁRIOS ========== //
  removeDuplicate(): void {
    const array = new Set<String>();

    this.costCenter.forEach((item) => {
      array.add(item.centro_custo)
    });

    this.costCenterUnique = Array.from(array).sort();
  }
}

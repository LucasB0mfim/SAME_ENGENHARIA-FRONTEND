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

  // ========== ESTADOS ========== //
  items: any[] = [];
  filteredItems: any[] = [];
  costCenter: any[] = [];
  costCenterUnique: String[] = [];

  employee: string = '';

  isLoading: boolean = true;
  isFind: boolean = false;

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

  // ========== ABRIR O FORMULÁRIO COM OS DADOS DO COLABORADOR ========== //



  // ========== TROCAR ENTRE TELAS ========== //
  openModal(item: any): void {

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

  // ========== UTILITÁRIOS ========== //
  removeDuplicate(): void {
    const array = new Set<String>();

    this.costCenter.forEach((item) => {
      array.add(item.centro_custo)
    });

    this.costCenterUnique = Array.from(array).sort();
  }
}

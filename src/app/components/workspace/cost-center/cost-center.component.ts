import { Chart } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TitleService } from '../../../core/services/title.service.js';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IndicatorService } from '../../../core/services/indicator.service.js';
import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';

interface CostCenterIndicator {
  nome_centro_custo: string;
  total_receber: string;
  total_pago_material: string;
  material_pago: string;
  material_apagar: string;
  total_pago_servico: string;
  servico_pago: string;
  servico_apagar: string;
  folha_pagamento: string;
}

@Component({
  selector: 'app-cost-center',
  standalone: true,
  imports: [CommonModule, NgChartsModule, MatIconModule, MatProgressSpinnerModule, FormsModule],
  templateUrl: './cost-center.component.html',
  styleUrl: './cost-center.component.scss'
})
export class CostCenterComponent implements OnInit {
  private chartInstance: Chart | undefined;
  private _titleService = inject(TitleService);
  private readonly _indicatorService = inject(IndicatorService);

  @ViewChild('lineChart', { static: true }) ctx: ElementRef | undefined;

  isSelectOpen: boolean = false;
  isLoading: boolean = false;
  hasSelection: boolean = false;

  centroCustoField: string = 'Nenhum';
  uniqueCostCenter: string[] = [];
  indicators: CostCenterIndicator[] = [];
  indicatorsCopie: CostCenterIndicator[] = [];
  activeSection: Record<string, string> = {};

  ngOnInit(): void {
    this._titleService.setTitle('Centro de Custo');
    this.getIndicators();
  }

  getIndicators() {
    this.isLoading = true;
    this._indicatorService.findCostCenter().subscribe({
      next: (data) => {
        this.indicators = data.result.filter((item: CostCenterIndicator) =>
          item.nome_centro_custo !== 'Outro Centro de Custo'
        );
        this.indicatorsCopie = [...this.indicators];
        this.removeDuplicate();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Não foi possível buscar os registros financeiros: ', error);
        this.isLoading = false;
      }
    });
  }

  startChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = undefined;
    }

    const indicator = this.indicatorsCopie.find(
      (item) => item.nome_centro_custo === this.centroCustoField
    ) || this.indicatorsCopie[0];

    const labels = [
      'Total a Receber',
      'Total Pago Material',
      'Material Pago',
      'Material a Pagar',
      'Total Pago Serviço',
      'Serviço Pago',
      'Serviço a Pagar',
      'Folha de Pagamento'
    ];

    const data = [
      this.formateValue(indicator.total_receber),
      this.formateValue(indicator.total_pago_material),
      this.formateValue(indicator.material_pago),
      this.formateValue(indicator.material_apagar),
      this.formateValue(indicator.total_pago_servico),
      this.formateValue(indicator.servico_pago),
      this.formateValue(indicator.servico_apagar),
      this.formateValue(indicator.folha_pagamento)
    ];

    this.chartInstance = new Chart(this.ctx?.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: indicator.nome_centro_custo,
          data: data,
          borderWidth: 2,
          borderColor: '#FFCC00',
          backgroundColor: '#FF9500',
          barThickness: 40,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          },
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              align: 'center',
              font: {
                size: 12
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  formateValue(value: string): number {
    const onlyNumber = value.replace('R$ ', '');
    const removePoint = onlyNumber.replace(/\./g, '');
    const addDecimal = removePoint.replace(',', '.');
    return parseFloat(addDecimal) || 0;
  }

  applyFilters() {
    let filteredData = [...this.indicators];

    if (this.centroCustoField && this.centroCustoField !== 'Nenhum') {
      filteredData = filteredData.filter(
        (item) => item.nome_centro_custo === this.centroCustoField
      );
      this.indicatorsCopie = filteredData;
      this.startChart();
    } else {
      this.indicatorsCopie = filteredData;
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = undefined;
      }
    }
  }

  removeDuplicate(): void {
    const constCenterArray = new Set<string>();
    this.indicators.forEach((item) => {
      if (item.nome_centro_custo && item.nome_centro_custo.trim() !== '') {
        constCenterArray.add(item.nome_centro_custo);
      }
    });
    this.uniqueCostCenter = Array.from(constCenterArray).sort();
  }

  toggleSelect(): void {
    setTimeout(() => {
      this.isSelectOpen = !this.isSelectOpen;
    }, 0);
  }

  resetSelectIcon(): void {
    this.isSelectOpen = false;
  }
}

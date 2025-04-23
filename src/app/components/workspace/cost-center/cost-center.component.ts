import { Chart } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TitleService } from '../../../core/services/title.service.js';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IndicatorService } from '../../../core/services/indicator.service.js';
import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ThemeService } from '../../../core/services/theme.service.js';

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
  // CAPTURAR O CANVAS NO HTML
  @ViewChild('lineChart', { static: true }) ctx: ElementRef | undefined;

  // INJEÇÃO DE DEPENDENCIAS
  private readonly _themeService = inject(ThemeService);
  private chartInstance: Chart | undefined;
  private _titleService = inject(TitleService);
  private readonly _indicatorService = inject(IndicatorService);

  // GERENCIAR ESTADO
  isDarkTheme: boolean = false;
  isSelectOpen: boolean = false;
  hasSelection: boolean = false;
  activeSection: Record<string, string> = {};

  // VARIÁVEL DO FILTRO
  centroCustoField: string = 'Nenhum';

  // VARIÁVEL PARA RECEBER APENAS UM TIPO DE CENTRO DE CUSTO
  uniqueCostCenter: string[] = [];

  // MODELOS
  indicators: CostCenterIndicator[] = [];
  indicatorsCopie: CostCenterIndicator[] = [];

  // HOOK DE CICLO
  ngOnInit(): void {
    this._titleService.setTitle('Centro de Custo');


    this._themeService.getThemeState().subscribe(theme => {
      this.isDarkTheme = theme;

      if (this.chartInstance) this.updateChartColors();
    })

    this.getIndicators();
  }

  // BUSCAR OS INDICADORES NA API
  getIndicators() {
    this._indicatorService.findCostCenter().subscribe({
      next: (data) => {
        this.indicators = data.result.filter((item: CostCenterIndicator) =>
          item.nome_centro_custo !== 'Outro Centro de Custo'
        );
        this.indicatorsCopie = [...this.indicators];
        this.removeDuplicate();
        this.applyFilters();
      },
      error: (error) => {
        console.error('Não foi possível buscar os registros financeiros: ', error);
      }
    });
  }

  // COR DAS LINHAS E DO TEXTO
  getThemeColors() {
    if (this.isDarkTheme) {
      return {
        grid: '#3c3c4b',
        text: '#ffffff'
      };
    } else {
      return {
        grid: '#e0e0e0',
        text: '#333333'
      };
    }
  }

  // COR DAS BARRAS
  getBarColors() {
    return {
      borderColor: '#FFCC00',
      backgroundColor: '#FF9500'
    };
  }

  // ATUALIZA AS CORES DE ACORDO COM O TEMA ATUAL
  updateChartColors() {
    if (!this.chartInstance) return;

    const themeColors = this.getThemeColors();
    const scales = this.chartInstance.options.scales;

    // Verificações mais rigorosas para evitar erros de nulo
    if (scales && scales['x']) {
      if (scales['x'].grid) {
        scales['x'].grid.color = themeColors.grid;
      }

      if (scales['x'].ticks) {
        scales['x'].ticks.color = themeColors.text;
      }
    }

    if (scales && scales['y']) {
      if (scales['y'].grid) {
        scales['y'].grid.color = themeColors.grid;
      }

      if (scales['y'].ticks) {
        scales['y'].ticks.color = themeColors.text;
      }
    }

    this.chartInstance.update();
  }

  // CONFIGURAÇÃO DO GRÁFICO
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

    const themeColors = this.getThemeColors();
    const barColors = this.getBarColors();

    this.chartInstance = new Chart(this.ctx?.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: indicator.nome_centro_custo,
          data: data,
          borderWidth: 2,
          borderColor: barColors.borderColor,
          backgroundColor: barColors.backgroundColor,
          barThickness: 40,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: themeColors.grid
            },
            ticks: {
              color: themeColors.text
            }
          },
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              align: 'center',
              font: {
                size: 12
              },
              color: themeColors.text
            },
            grid: {
              color: themeColors.grid
            }
          }
        },
        plugins: {
          legend: {
            display: false,
            labels: {
              color: themeColors.text
            }
          }
        }
      }
    });
  }

  // FORMATAR O PREÇO DA API
  formateValue(value: string): number {
    const onlyNumber = value.replace('R$ ', '');
    const removePoint = onlyNumber.replace(/\./g, '');
    const addDecimal = removePoint.replace(',', '.');
    return parseFloat(addDecimal) || 0;
  }

  // CALCULAR O FATURAMENTO DE CENTRO DE CUSTO
  calculateFaturamento(): string {
    if (this.centroCustoField === 'Nenhum') {
      return '0,00';
    }

    const indicator = this.indicatorsCopie.find(
      (item) => item.nome_centro_custo === this.centroCustoField
    );

    if (!indicator) {
      return '0,00';
    }

    const totalReceber = this.formateValue(indicator.total_receber);
    const totalPagoMaterial = this.formateValue(indicator.total_pago_material);
    const totalPagoServico = this.formateValue(indicator.total_pago_servico);
    const folhaPagamento = this.formateValue(indicator.folha_pagamento);

    const total = totalReceber - totalPagoMaterial - totalPagoServico - folhaPagamento;

    return total.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }


  // APLICAR FILTROS DE BUSCA
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

  // REMOVER DUPLICATAS
  removeDuplicate(): void {
    const constCenterArray = new Set<string>();
    this.indicators.forEach((item) => {
      if (item.nome_centro_custo && item.nome_centro_custo.trim() !== '') {
        constCenterArray.add(item.nome_centro_custo);
      }
    });
    this.uniqueCostCenter = Array.from(constCenterArray).sort();
  }

  // ALTERAR O ESTADO DO SELECT
  toggleSelect(): void {
    setTimeout(() => {
      this.isSelectOpen = !this.isSelectOpen;
    }, 0);
  }

  // REINICIAR ESTADO DO SELECT
  resetSelectIcon(): void {
    this.isSelectOpen = false;
  }
}

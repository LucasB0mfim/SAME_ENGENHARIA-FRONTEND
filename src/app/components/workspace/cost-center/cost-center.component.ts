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
  @ViewChild('lineChart', { static: true }) ctx: ElementRef | undefined;

  // INJEÇÃO DE DEPENDÊNCIA
  private chartInstance: Chart | undefined;
  private _titleService = inject(TitleService);
  private readonly _themeService = inject(ThemeService);
  private readonly _indicatorService = inject(IndicatorService);

  // GERENCIAR ESTADO
  isDarkTheme: boolean = false;
  isSelectOpen: boolean = false;
  hasSelection: boolean = false;
  activeSection: Record<string, string> = {};

  // FILTRO
  centroCustoField: string = 'Geral';

  // MODELOS
  uniqueCostCenter: string[] = [];
  indicators: CostCenterIndicator[] = [];
  indicatorsCopie: CostCenterIndicator[] = [];

  // HOOK DE CICLO
  ngOnInit(): void {
    this._titleService.setTitle('Centro de Custo');

    this._themeService.getThemeState().subscribe(theme => {
      this.isDarkTheme = theme;
      if (this.chartInstance) this.updateChartColors();
    });

    this.getIndicators();
  }

  // BUSCAR INDICADORES NA API
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

  // DEFINIR COR DAS GRADES E LETRAS DO GRÁFICO
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

  // DENIFIR COR DAS BARRAS DO GRÁFICO
  getBarColors() {
    return {
      borderColor: '#D9480F',
      backgroundColor: '#FFA94D'
    };
  }

  // ATUALIZAR TEMA DO GRÁFICO COM BASE NO TEMA DO SITE
  updateChartColors() {
    if (!this.chartInstance) return;

    const themeColors = this.getThemeColors();
    const scales = this.chartInstance.options.scales;

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

  // INICIA O GRÁFICO
  startChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = undefined;
    }

    if (this.centroCustoField === 'Geral') {
      this.createGeneralChart();
    } else {
      this.createSpecificChart();
    }
  }

  // DEFINI OS DADOS DO GRÁFICO
  createSpecificChart() {
    const indicator = this.indicatorsCopie.find(
      (item) => item.nome_centro_custo === this.centroCustoField
    );

    if (!indicator) return;

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

    this.createBarChart(labels, data, indicator.nome_centro_custo);
  }

  // CONFIGURAÇÃO DO GRÁFICO 'GERAL'
  createGeneralChart() {
    const labels = this.uniqueCostCenter;
    const data = this.uniqueCostCenter.map(centro => {
      const indicator = this.indicators.find(item => item.nome_centro_custo === centro);
      return indicator ? this.formateValue(indicator.total_receber) : 0;
    });

    this.createBarChart(labels, data, 'Total a Receber');
  }

  // CONFIGURAÇÃO DO GRÁFICO 'POR CENTRO DE CUSTO'
  createBarChart(labels: string[], data: number[], title: string) {
    const themeColors = this.getThemeColors();
    const barColors = this.getBarColors();

    this.chartInstance = new Chart(this.ctx?.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: title,
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
              display: this.centroCustoField !== 'Geral',
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
          },
        }
      }
    });
  }

  // FORMATA O VALOR PARA BRL
  formateValue(value: string): number {
    const onlyNumber = value.replace('R$ ', '');
    const removePoint = onlyNumber.replace(/\./g, '');
    const addDecimal = removePoint.replace(',', '.');
    return parseFloat(addDecimal) || 0;
  }

  // CALCULA O FATURAMENTO TOTAL (RECEITA)
  calculateFaturamento(): string {
    if (this.centroCustoField === 'Geral') {
      let totalGeral = 0;

      this.indicators.forEach(indicator => {
        const totalReceber = this.formateValue(indicator.total_receber);
        totalGeral += totalReceber;
      });

      return totalGeral.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      const indicator = this.indicatorsCopie.find(
        (item) => item.nome_centro_custo === this.centroCustoField
      );

      if (!indicator) {
        return '0,00';
      }

      const totalReceber = this.formateValue(indicator.total_receber);

      return totalReceber.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  }

  // CALCULA O GASTO TOTAL
  calculateGasto(): string {
    if (this.centroCustoField === 'Geral') {
      let totalGeral = 0;

      this.indicators.forEach(indicator => {
        const totalPagoMaterial = this.formateValue(indicator.total_pago_material);
        const totalPagoServico = this.formateValue(indicator.total_pago_servico);
        const folhaPagamento = this.formateValue(indicator.folha_pagamento);

        const gastoTotal = totalPagoMaterial - totalPagoServico - folhaPagamento;
        totalGeral -= gastoTotal;
      });

      return totalGeral.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      const indicator = this.indicatorsCopie.find(
        (item) => item.nome_centro_custo === this.centroCustoField
      );

      if (!indicator) {
        return '0,00';
      }

      const totalPagoMaterial = this.formateValue(indicator.total_pago_material);
      const totalPagoServico = this.formateValue(indicator.total_pago_servico);
      const folhaPagamento = this.formateValue(indicator.folha_pagamento);

      const total = totalPagoMaterial + totalPagoServico + folhaPagamento;

      return total.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  }

  // CALCULO O SALDO TOTAL DE UMA OBRA
  calculateSaldo(): string {
    if (this.centroCustoField === 'Geral') {
      let totalGeral = 0;

      this.indicators.forEach(indicator => {
        const totalReceber = this.formateValue(indicator.total_receber);
        const totalPagoMaterial = this.formateValue(indicator.total_pago_material);
        const totalPagoServico = this.formateValue(indicator.total_pago_servico);
        const folhaPagamento = this.formateValue(indicator.folha_pagamento);

        const saldoObra = totalReceber - totalPagoMaterial - totalPagoServico - folhaPagamento;
        totalGeral += saldoObra;
      });

      return totalGeral.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
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
  }

  // ALTERA A COR DO SALDO
  isSaldoPositive(): boolean {
    if (this.centroCustoField === 'Geral') {
      const totalGeral = this.indicators.reduce((sum, indicator) => {
        const totalReceber = this.formateValue(indicator.total_receber);
        const totalPagoMaterial = this.formateValue(indicator.total_pago_material);
        const totalPagoServico = this.formateValue(indicator.total_pago_servico);
        const folhaPagamento = this.formateValue(indicator.folha_pagamento);
        return sum + (totalReceber - totalPagoMaterial - totalPagoServico - folhaPagamento);
      }, 0);
      return totalGeral >= 0;
    } else {
      const indicator = this.indicatorsCopie.find(
        (item) => item.nome_centro_custo === this.centroCustoField
      );
      if (!indicator) return true;

      const totalReceber = this.formateValue(indicator.total_receber);
      const totalPagoMaterial = this.formateValue(indicator.total_pago_material);
      const totalPagoServico = this.formateValue(indicator.total_pago_servico);
      const folhaPagamento = this.formateValue(indicator.folha_pagamento);

      return (totalReceber - totalPagoMaterial - totalPagoServico - folhaPagamento) >= 0;
    }
  }

  // FILTRAR POR CENTRO DE CUSTO
  applyFilters() {
    if (this.centroCustoField === 'Geral') {
      this.indicatorsCopie = [...this.indicators];
    } else {
      this.indicatorsCopie = this.indicators.filter(
        (item) => item.nome_centro_custo === this.centroCustoField
      );
    }
    this.startChart();
  }

  // REMOVE AS DUPLICATAS DE CENTRO DE CUSTO
  removeDuplicate(): void {
    const constCenterArray = new Set<string>();
    this.indicators.forEach((item) => {
      if (item.nome_centro_custo && item.nome_centro_custo.trim() !== '') {
        constCenterArray.add(item.nome_centro_custo);
      }
    });
    this.uniqueCostCenter = Array.from(constCenterArray).sort();
  }

  // ALTERA O ESTADO DO SELECT
  toggleSelect(): void {
    setTimeout(() => {
      this.isSelectOpen = !this.isSelectOpen;
    }, 0);
  }

  // REINICIA O ESTADO DO SELECT
  resetSelectIcon(): void {
    this.isSelectOpen = false;
  }
}

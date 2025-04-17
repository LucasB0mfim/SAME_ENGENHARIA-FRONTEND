import { Component, inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { IndicatorService } from '../../../core/services/indicator.service.js';
import { TitleService } from '../../../core/services/title.service.js';

@Component({
  selector: 'app-cost-center',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './cost-center.component.html',
  styleUrl: './cost-center.component.scss'
})
export class CostCenterComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private _titleService = inject(TitleService);
  private readonly _indicatorService = inject(IndicatorService);
  private readonly cdr = inject(ChangeDetectorRef);

  costCenter: any[] = [];
  selectedCostCenter: any = null;

  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
        grid: {
          display: true
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true
        },
        ticks: {
          display: true
        },
        display: true
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += 'R$ ' + context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            return label;
          }
        }
      }
    },
    onClick: (event: any, elements: any) => {
      if (elements && elements.length > 0) {
        const index = elements[0].index;
        this.selectCostCenterByIndex(index);
      }
    }
  }

  ngOnInit(): void {
    this.getCostCenter();
    this._titleService.setTitle('Centro de Custo');
  }

  getCostCenter() {
    this._indicatorService.findCostCenter().subscribe({
      next: (data) => {
        this.costCenter = data.result.filter((item: { nome_centro_custo: string }) =>
          item.nome_centro_custo !== 'Outro Centro de Custo'
        );

        if (this.costCenter.length > 0) {
          this.selectedCostCenter = {...this.costCenter[0]};
        }
        this.updateChartData();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Não foi possível buscar os registros financeiros: ', error);
      }
    });
  }

  selectCostCenterByIndex(index: number) {
    if (index >= 0 && index < this.costCenter.length) {
      this.selectedCostCenter = {...this.costCenter[index]};
      this.cdr.detectChanges();
    }
  }

  updateChartData() {
    const labels = this.costCenter.map(item => item.nome_centro_custo);

    const datasets = [{
      data: this.costCenter.map(item => {
        const material = this.formateValue(item.total_pago_material);
        const servico = this.formateValue(item.total_pago_servico);
        const folha = this.formateValue(item.folha_pagamento);
        return material + servico + folha;
      }),
      label: 'Total',
      backgroundColor: 'rgb(255, 111, 0)',
      borderColor: 'rgb(255, 111, 0)',
      hoverBackgroundColor: 'rgb(255, 131, 37)',
      barThickness: 30,
    }];

    this.barChartData = {
      labels: labels,
      datasets: datasets
    };

    if (this.chart?.chart) {
      this.chart.chart.update();
    }
  }

  formateValue(constructionPrice: string): number {
    if (!constructionPrice || typeof constructionPrice !== 'string') {
      return 0;
    }

    try {
      const numStr = constructionPrice
        .replace('R$ ', '')
        .replace(/\./g, '')
        .replace(',', '.');

      const value = parseFloat(numStr);
      return isNaN(value) ? 0 : value;
    } catch (error) {
      return 0;
    }
  }

  getTotalGasto(): string {
    if (!this.selectedCostCenter) return 'N/A';

    const material = this.formateValue(this.selectedCostCenter.total_pago_material);
    const servico = this.formateValue(this.selectedCostCenter.total_pago_servico);
    const folha = this.formateValue(this.selectedCostCenter.folha_pagamento);
    const total = material + servico + folha;

    return 'R$ ' + total.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}

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
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false
        },
        ticks: {
          display: false
        },
        display: false
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
      console.log('Graph click event:', event);
      console.log('Clicked elements:', elements);

      if (elements && elements.length > 0) {
        const index = elements[0].index;
        console.log('Selected index:', index);
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
        console.log('API response data:', data);
        this.costCenter = data.result.filter((item: { nome_centro_custo: string }) =>
          item.nome_centro_custo !== 'Outro Centro de Custo'
        );
        console.log('Filtered cost centers:', this.costCenter);

        if (this.costCenter.length > 0) {
          this.selectedCostCenter = {...this.costCenter[0]};
          console.log('Initial selected cost center:', this.selectedCostCenter);
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
    console.log('Selecting cost center by index:', index);
    console.log('Available cost centers:', this.costCenter);

    if (index >= 0 && index < this.costCenter.length) {
      this.selectedCostCenter = {...this.costCenter[index]};
      console.log('New selected cost center:', this.selectedCostCenter);
      this.cdr.detectChanges();
    } else {
      console.warn('Invalid index:', index);
    }
  }

  updateChartData() {
    console.log('Updating chart data...');

    const labels = this.costCenter.map(item => item.nome_centro_custo);
    console.log('Chart labels:', labels);

    const datasets = [{
      data: this.costCenter.map(item => {
        const material = this.formateValue(item.total_pago_material);
        const servico = this.formateValue(item.total_pago_servico);
        const folha = this.formateValue(item.folha_pagamento);
        const total = material + servico + folha;
        console.log(`Calculating total for ${item.nome_centro_custo}:`, {material, servico, folha, total});
        return total;
      }),
      label: 'Total',
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderColor: 'rgba(99, 102, 241, 1)',
      hoverBackgroundColor: 'rgba(99, 102, 241, 1)',
      barThickness: 30,
    }];

    this.barChartData = {
      labels: labels,
      datasets: datasets
    };

    console.log('Updated chart data:', this.barChartData);

    if (this.chart?.chart) {
      this.chart.chart.update();
    }
  }

  formateValue(constructionPrice: string): number {
    if (!constructionPrice || typeof constructionPrice !== 'string') {
      console.warn('Invalid construction price:', constructionPrice);
      return 0;
    }

    try {
      const numStr = constructionPrice
        .replace('R$ ', '')
        .replace(/\./g, '')
        .replace(',', '.');

      const value = parseFloat(numStr);
      const result = isNaN(value) ? 0 : value;
      console.log(`Formatted value: ${constructionPrice} -> ${result}`);
      return result;
    } catch (error) {
      console.error('Error formatting value:', error);
      return 0;
    }
  }
}

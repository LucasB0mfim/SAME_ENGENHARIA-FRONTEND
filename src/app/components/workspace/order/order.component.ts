import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core'; // Adicionei ElementRef e ViewChild
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { OrderService } from '../../../core/services/order.service';
import { ICommonData } from '../../../core/interfaces/order-response.interface';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  private __titleService = inject(TitleService);
  private readonly __orderService = inject(OrderService);
  private readonly __employeeService = inject(DashboardService);

  @ViewChild('fileLabel') fileLabel!: ElementRef; // Referência ao label

  record: any[] = [];
  recordOC: Record<string, ICommonData> = {};
  pendingOrders: Record<string, ICommonData> = {};
  filteredPendingOrders: Record<string, ICommonData> = {};

  activeSection: Record<string, string> = {};
  expandedIndex: number | null = null;

  nota_fiscal: File | null = null;
  acceptedFile: string = '.png, .jpg, .jpeg, .gif, .bmp, .webp';
  email_employee: string = '';

  centro_custo: string = '';
  ordem_compra: string = '';
  fornecedor: string = '';
  valor: string = '';

  ngOnInit() {
    this.getUser();
    this.getOrder();
    this.__titleService.setTitle('Recebimento de Material');
  }

  getUser() {
    this.__employeeService.findAll().subscribe({
      next: (data) => this.email_employee = data.employee.email,
      error: (error) => console.error(error)
    });
  }

  getOrder() {
    this.__orderService.findAll().subscribe({
      next: (data) => {
        this.record = data.order;
        this.getCard();
      },
      error: (error) => console.error(error)
    });
  }

  getCard() {
    this.recordOC = this.record.reduce((acc: any, item: any) => {
      if (!acc[item.numero_oc]) {
        acc[item.numero_oc] = {
          data_criacao_oc: item.data_criacao_oc,
          numero_oc: item.numero_oc,
          fornecedor: item.fornecedor,
          previsao_entrega: item.previsao_entrega,
          centro_custo: item.centro_custo,
          usuario_criacao: item.usuario_criacao,
          data_entrega: item.data_entrega,
          nota_fiscal: item.nota_fiscal,
          registrado: item.registrado,
          order: []
        };
      }
      acc[item.numero_oc].order.push({
        idprd: item.idprd,
        data_criacao_oc: item.data_criacao_oc,
        material: item.material,
        quantidade: item.quantidade,
        unidade: item.unidade,
        valor_unitario: item.valor_unitario,
        valor_total: item.valor_total,
        status: item.status || 'PENDENTE',
        data_entrega: item.data_entrega,
        nota_fiscal: item.nota_fiscal,
        registrado: item.registrado,
        quantidade_entregue: item.quantidade_entregue,
      });
      return acc;
    }, {});

    this.filterPendingOrders();
  }

  filterPendingOrders() {
    this.pendingOrders = Object.fromEntries(
      Object.entries(this.recordOC).filter(([_, oc]) =>
        oc.order.every(item => item.status === 'PENDENTE')
      )
    );
    this.applyFilters();
  }

  applyFilters() {
    this.filteredPendingOrders = Object.fromEntries(
      Object.entries(this.pendingOrders).filter(([_, oc]) => {
        const matchesCentroCusto = !this.centro_custo || oc.centro_custo.toLowerCase().includes(this.centro_custo.toLowerCase());
        const matchesOrdemCompra = !this.ordem_compra || oc.numero_oc.toString().includes(this.ordem_compra);
        const matchesFornecedor = !this.fornecedor || oc.fornecedor.toLowerCase().includes(this.fornecedor.toLowerCase());
        const matchesValor = !this.valor || this.calculateTotalValue(oc.order).toString().includes(this.valor);
        return matchesCentroCusto && matchesOrdemCompra && matchesFornecedor && matchesValor;
      })
    );
  }

  isFilteredPendingOrdersEmpty(): boolean {
    return Object.keys(this.filteredPendingOrders).length === 0;
  }

  searchCentroCusto() { this.applyFilters(); }
  searchOrdemCompra() { this.applyFilters(); }
  searchFornecedor() { this.applyFilters(); }
  searchValor() { this.applyFilters(); }

  calculateTotalValue(order: any[]): number {
    return order.reduce((sum, item) => sum + parseFloat(item.valor_total || 0), 0);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.nota_fiscal = input.files[0]; // Armazena o arquivo selecionado
      this.fileLabel.nativeElement.textContent = this.nota_fiscal.name; // Atualiza o label com o nome do arquivo
    }
  }

  private formatDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  deliveredOrder(numero_oc: string) {
    const itemsOC = this.recordOC[numero_oc].order;
    itemsOC.forEach((item: any) => {
      if (!this.nota_fiscal) return;
      const formData = new FormData();
      formData.append('idprd', item.idprd);
      formData.append('status', 'ENTREGUE');
      formData.append('data_entrega', this.formatDate());
      formData.append('nota_fiscal', this.nota_fiscal, this.nota_fiscal.name);
      formData.append('registrado', this.email_employee);
      formData.append('quantidade_entregue', item.quantidade);
      this.__orderService.update(formData).subscribe({
        next: () => this.getOrder(),
        error: (error) => console.error(error)
      });
    });
  }

  orderPartiallyDelivered(numero_oc: string) {
    const itensOC = this.recordOC[numero_oc].order;
    itensOC.forEach((item: any) => {
      if (item.quantidade_entregue === undefined || item.quantidade_entregue < 0 || item.quantidade_entregue > item.quantidade) {
        alert(`Quantidade inválida para o item ${item.idprd}`);
        return;
      }
      const payload = {
        idprd: item.idprd,
        status: 'PARCIALMENTE ENTREGUE',
        data_entrega: this.formatDate(),
        registrado: this.email_employee,
        quantidade_entregue: item.quantidade_entregue
      };
      this.__orderService.updateStatus(payload).subscribe({
        next: () => this.getOrder(),
        error: (error) => console.error(error)
      });
    });
  }

  orderNotDelivered(numero_oc: string) {
    const itensOC = this.recordOC[numero_oc].order;
    itensOC.forEach((item: any) => {
      const payload = {
        idprd: item.idprd,
        status: 'NÃO ENTREGUE',
        data_entrega: this.formatDate(),
        registrado: this.email_employee,
        quantidade_entregue: '0'
      };
      this.__orderService.updateStatus(payload).subscribe({
        next: () => this.getOrder(),
        error: (error) => console.error(error)
      });
    });
  }

  toggleSection(event: Event, ocNumber: string, section: string) {
    event.stopPropagation();
    if (this.activeSection[ocNumber] === section) {
      this.activeSection[ocNumber] = '';
    } else {
      this.activeSection[ocNumber] = section;
    }
  }

  toggleExpand(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}

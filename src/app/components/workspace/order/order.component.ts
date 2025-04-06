import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../../core/services/order.service';
import { TitleService } from '../../../core/services/title.service';
import { ICommonData } from '../../../core/interfaces/order-response.interface';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  // Referências ViewChild
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Injeção de Dependências
  private readonly __orderService = inject(OrderService);
  private readonly __titleService = inject(TitleService);

  // Constantes
  readonly acceptedFileTypes: string = '.png, .jpeg, .webp';
  readonly maxFileSize: number = 5 * 1024 * 1024;

  // Variáveis de Estado
  isVoid: boolean = false;
  isLoading: boolean = true;
  isSelectOpen: boolean = false;
  expandedIndex: number | null = null;

  // Modelos de Dados
  order: any[] = [];
  originalOrder: any[] = [];
  purchaseOrder: Record<string, ICommonData> = {};
  activeSection: Record<string, string> = {};

  // Variáveis de Filtro
  ocField: string = '';
  fornecedorField: string = '';
  centroCustoField: string = '';
  centrosCustoUnicos: string[] = [];

  // Variáveis de Upload de Arquivos
  file: File | null = null;
  loadingFile: boolean = false;
  showError: boolean = false;
  showSuccess: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Hooks de Ciclo de Vida
  ngOnInit(): void {
    this.getOrder();
    this.__titleService.setTitle('Receber Material');
  }

  // Métodos de Dados de Pedidos
  getOrder(): void {
    this.__orderService.findAll().subscribe({
      next: (data) => {
        // Salvar os dados originais para filtragem posterior
        this.originalOrder = data.order;
        // Inicializar order com os dados originais
        this.order = [...this.originalOrder];

        this.removeDuplicate();
        this.groupByOC();
        this.initializeActiveSections();

        this.isLoading = false;
        this.isVoid = this.order.length === 0;
      },
      error: (error) => {
        console.error('Não foi possível carregar os pedidos:', error);
        this.isLoading = false;
        this.isVoid = true;
      }
    });
  }

  // Agrupar itens por OC
  groupByOC(): void {
    this.purchaseOrder = this.order.reduce((acc: any, item: any) => {
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
  }

  // Calcula o valor total do pedido
  calculateOrderTotal(orderData: ICommonData): number {
    const total = orderData.order.reduce((acc, item) => {
      const itemTotal = item.valor_total ? parseFloat(item.valor_total) : 0;
      return acc + itemTotal;
    }, 0);

    return Number(total.toFixed(2));
  }

  // Retorna apenas um centro de custo por vez
  removeDuplicate(): void {
    const centrosCustoSet = new Set<string>();

    this.originalOrder.forEach(item => {
      if (item.centro_custo && item.centro_custo.trim() !== '') {
        centrosCustoSet.add(item.centro_custo);
      }
    });

    this.centrosCustoUnicos = Array.from(centrosCustoSet).sort();
  }

  // Método para filtrar as OC's
  applyFilters(): void {
    // Aplicar filtros aos dados originais
    let filteredData = [...this.originalOrder];

    // Filtro por número OC
    if (this.ocField && this.ocField.trim() !== '') {
      filteredData = filteredData.filter(item =>
        item.numero_oc && item.numero_oc.toLowerCase().includes(this.ocField.toLowerCase())
      );
    }

    // Filtro por centro de custo
    if (this.centroCustoField && this.centroCustoField.trim() !== '') {
      filteredData = filteredData.filter(item =>
        item.centro_custo === this.centroCustoField
      );
    }

    // Filtro por fornecedor
    if (this.fornecedorField && this.fornecedorField.trim() !== '') {
      filteredData = filteredData.filter(item =>
        item.fornecedor?.toLowerCase().includes(this.fornecedorField.toLowerCase())
      );
    }

    // Atualizar os dados filtrados
    this.order = filteredData;

    // Reagrupar os dados filtrados por OC
    this.groupByOC();

    // Resetar o estado de expansão e seções ativas
    this.expandedIndex = null;
    this.initializeActiveSections();
  }

  // Métodos de Estado da Interface
  initializeActiveSections(): void {
    Object.keys(this.purchaseOrder).forEach(key => {
      this.activeSection[key] = 'details';
    });
  }

  toggleExpand(index: number, event?: Event): void {
    // Impedir propagação do evento se vier de um clique em botão
    if (event) {
      event.stopPropagation();
    }

    // Alternar estado expandido
    if (this.expandedIndex === index) {
      this.expandedIndex = null;
    } else {
      this.expandedIndex = index;
    }

    // Se clicar no cabeçalho (não em um botão), garantir que 'details' seja a seção ativa
    if (!event) {
      const ocKey = Object.keys(this.purchaseOrder)[index];
      this.activeSection[ocKey] = 'details';
    }
  }

  setActiveSection(key: string, section: string, index: number, event: Event): void {
    event.stopPropagation(); // Prevenir a expansão do card
    this.activeSection[key] = section;
    // Garantir que o card esteja expandido quando um botão for clicado
    this.expandedIndex = index;
  }

  toggleSelect(): void {
    setTimeout(() => {
      this.isSelectOpen = !this.isSelectOpen;
    }, 0);
  }

  resetSelectIcon(): void {
    this.isSelectOpen = false;
  }

  // Processa o arquivo selecionado pelo usuário
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.clearMessages();

    if (!this.validateFile(file)) {
      this.resetFileInput();
      return;
    }

    this.file = file;
  }

  // Processa o arquivo solto na área de upload
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files?.length) {
      const file = files[0];
      this.clearMessages();
      if (this.validateFile(file)) {
        this.file = file;
      }
    }
  }

  // Lida com o evento de arrastar e soltar arquivos
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  // Simula o clique no input de arquivo
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  // Valida o tipo e tamanho do arquivo
  private validateFile(file: File): boolean {
    // Verificar se a extensão do arquivo é válida
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['png', 'jpeg', 'jpg', 'webp'];

    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      this.setErrorMessage('Apenas arquivos PNG, JPEG e WEBP são aceitos');
      return false;
    }

    if (file.size > this.maxFileSize) {
      this.setErrorMessage('O arquivo excede o tamanho máximo de 5MB');
      return false;
    }

    return true;
  }

  // Limpa o input de arquivo
  private resetFileInput(): void {
    this.fileInput.nativeElement.value = '';
    this.file = null;
  }

  // Define mensagem de sucesso e ativa sua exibição
  private setSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
    this.showError = false;

    // Auto-ocultar mensagem após 3 segundos
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  // Define mensagem de erro e ativa sua exibição
  private setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    this.showSuccess = false;

    // Auto-ocultar mensagem após 5 segundos
    setTimeout(() => {
      this.showError = false;
    }, 5000);
  }

  // Limpa todas as mensagens
  private clearMessages(): void {
    this.showError = false;
    this.showSuccess = false;
    this.errorMessage = '';
    this.successMessage = '';
  }
}

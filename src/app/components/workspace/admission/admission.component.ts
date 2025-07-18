import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../core/services/title.service';
import { AdmissionService } from '../../../core/services/admission.service';

@Component({
  selector: 'app-admission',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './admission.component.html',
  styleUrl: './admission.component.scss'
})
export class AdmissionComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private readonly _admissionService = inject(AdmissionService);


  // ========== ESTADOS ========== //
  link: string = '';

  rotate = false;

  items: any[] = [];
  filteredItems: any[] = [];
  currentItem: any = null;

  isLoading: boolean = true;
  isEmpty: boolean = false;
  isDeleting: boolean = false;

  showMessage: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  isBodyVisible: boolean[] = [];
  isModalVisible: boolean = false;
  isModalDeleteVisible: boolean = false;

  modalType: string = '';
  modalTitle: string = '';

  // ========== HOOK ========== //
  ngOnInit(): void {
    this._titleService.setTitle('Admissão');
    this.getAdmission();
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

  // ========== API ========== //
  generateLink() {
    console.log('Botão GERAR LINK clicado');
    this._admissionService.generateLink().subscribe({
      next: (res) => {
        console.log('Resposta do serviço:', res);
        this.link = res.link;
        console.log('Link atribuído:', this.link);
        navigator.clipboard.writeText(this.link)
          .then(() => {
            console.log('Link copiado para a área de transferência');
            this.setMessage('Link gerado e copiado com sucesso!', 'success');
          })
          .catch((err) => {
            console.error('Erro ao copiar link:', err);
            this.setMessage('Erro ao copiar o link. Tente novamente.', 'error');
          });
      },
      error: (err) => {
        console.error('Erro ao gerar link:', err);
        this.setMessage('Erro ao gerar o link. Tente novamente.', 'error');
      }
    });
  }

  getAdmission() {
    this._admissionService.getAdmission().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.items = res.result;
        this.filteredItems = [...this.items];
        this.isBodyVisible = new Array(this.items.length).fill(false);

        if (this.filteredItems.length === 0) {
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
        }
      },
      error: (err) => {
        console.error('Erro ao consultar admissões.', err);
      }
    })
  }

  deleteAdmission() {
    this.isDeleting = true;

    const id = this.currentItem.id;

    this._admissionService.deleteById(id).subscribe({
      next: (res) => {
        this.isDeleting = false;
        this.getAdmission();
        this.setMessage('Admissão deletada com sucesso!', 'success');
        this.isModalDeleteVisible = false;
      },
      error: (err) => {
        this.isDeleting = false;
        this.isModalDeleteVisible = false;
        console.log('Erro ao tentar deletar admissão', err);
        this.setMessage('Não foi possível deletar a admissão. Tente novamente outra hora!', 'error');
      }
    })
  }

  // ========== RECARREGAR A LISTA ========== //
  reload() {
    this.items = [];
    this.filteredItems = [];
    this.isEmpty = false;
    this.isLoading = true;
    this.getAdmission();
  }

  // ========== GERENCIAR MODAL ========== //
  toggleBodyVisibility(index: number): void {
    this.isBodyVisible[index] = !this.isBodyVisible[index];
  }

  openModalDelete(item: any): void {
    this.isModalVisible = false;
    this.isModalDeleteVisible = true;
    this.currentItem = item;
  }

  openModal(item: any, type: string): void {
    this.currentItem = item;
    this.modalType = type;
    this.isModalVisible = true;

    switch (type) {
      case 'photo':
        this.modalTitle = 'Foto 3x4';
        break;
      case 'cpf':
        this.modalTitle = 'CPF';
        break;
      case 'rg':
        this.modalTitle = 'RG';
        break;
      case 'residence':
        this.modalTitle = 'Comprovante de Residência';
        break;
      case 'certificate':
        this.modalTitle = 'Certificado';
        break;
      default:
        this.modalTitle = 'Documento';
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.modalType = '';
    this.modalTitle = '';
    this.currentItem = null;
  }

  closeModalDelete(): void {
    this.isModalDeleteVisible = false;
  }

  hasDocument(): boolean {
    if (!this.currentItem) return false;

    switch (this.modalType) {
      case 'photo':
        return !!this.currentItem.photo_3x4;
      case 'cpf':
        return !!this.currentItem.cpf_image;
      case 'rg':
        return !!(this.currentItem.rg_front || this.currentItem.rg_back);
      case 'residence':
        return !!this.currentItem.residence_proof;
      case 'certificate':
        return !!this.currentItem.certificate;
      default:
        return false;
    }
  }

  // ========== FILTRO ========== //
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredItems = this.items.filter((item: any) =>
      item.name.toLowerCase().includes(filterValue)
    );
    this.isEmpty = this.filteredItems.length === 0;
  }

  // ========== MÉTODOS AUXILIARES ========== //
  buildImageUrl(imageName: string): string {
    return `https://sameengenharia.com.br/api/admission/documents/${imageName}`;
  }

  formateDate(date: string) {
    const year = date.split('-')[0];
    const month = date.split('-')[1];
    const day = date.split('-')[2];

    return `${day}/${month}/${year}`
  }

  formatePhone(phone: string): string {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  }

  formateCPF(cpf: string): string {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
  }

  formatePIS(cpf: string): string {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 8)}.${cpf.slice(8, 10)}-${cpf.slice(10, 11)}`;
  }

  triggerRotate() {
    this.rotate = true;

    setTimeout(() => {
      this.rotate = false;
    }, 600);
  }
}










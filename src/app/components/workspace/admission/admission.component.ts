import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../core/services/title.service';
import { AdmissionService } from '../../../core/services/admission.service';

@Component({
  selector: 'app-admission',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './admission.component.html',
  styleUrl: './admission.component.scss'
})
export class AdmissionComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private _titleService = inject(TitleService);
  private readonly _admissionService = inject(AdmissionService);

  updateForm: FormGroup = new FormGroup({
    status: new FormControl('', Validators.required),
  })

  // ========== ESTADOS ========== //
  link: string = '';

  rotate = false;

  items: any[] = [];
  filteredItems: any[] = [];
  currentItem: any = null;

  isLoading: boolean = true;
  isEmpty: boolean = false;
  isDeleting: boolean = false;
  isGenerating: boolean = false;
  isUpdating: boolean = false;

  new: boolean = false;
  inProgress: boolean = false;
  completed: boolean = false;
  failed: boolean = false;
  canceled: boolean = false;

  // Contadores para cada status
  newCount: number = 0;
  inProgressCount: number = 0;
  completedCount: number = 0;
  failedCount: number = 0;
  canceledCount: number = 0;

  activeFilter: string = 'NOVO';
  currentStatus: string = '';

  showMessage: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  isBodyVisible: boolean[] = [];
  isModalVisible: boolean = false;
  isModalEditVisible: boolean = false;
  isModalDeleteVisible: boolean = false;

  modalType: string = '';
  modalTitle: string = '';



  // ========== HOOK ========== //
  ngOnInit(): void {
    this.getAdmission('NOVO');
    this.getAdmissionLength();
    this._titleService.setTitle('Admissão');
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
  generateLink(): void {
    this.isGenerating = true;

    this._admissionService.generateLink().subscribe({
      next: (res) => {
        this.link = res.link;
        this.isGenerating = false;
        this.getAdmissionLength(); // Atualizar contagens após gerar link
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
        this.isGenerating = false;
        console.error('Erro ao gerar link:', err);
        this.setMessage('Erro ao gerar o link. Tente novamente.', 'error');
      }
    });
  }

  filteredAdmission(status: string) {
    this.activeFilter = status;
    this.currentStatus = status;

    if (status === 'NOVO') {
      this.new = true;
      this.getAdmission('NOVO');
    } else if (status === 'EM ANDAMENTO') {
      this.inProgress = true;
      this.getAdmission('EM ANDAMENTO');
    } else if (status === 'CONCLUIDO') {
      this.completed = true;
      this.getAdmission('CONCLUIDO');
    } else if (status === 'REPROVADO') {
      this.failed = true;
      this.getAdmission('REPROVADO');
    } else if (status === 'CANCELADO') {
      this.canceled = true;
      this.getAdmission('CANCELADO');
    }
  }

  getAdmission(status: string): void {
    this.isEmpty = false;
    this.filteredItems = [];
    this.isLoading = true;

    const request = {
      status: status
    }

    this._admissionService.getAdmission(request).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.new = false;
        this.inProgress = false;
        this.completed = false;
        this.canceled = false;
        this.failed = false;
        this.items = res.result;
        this.filteredItems = [...this.items];
        this.isEmpty = this.filteredItems.length === 0;
      },
      error: (err) => {
        this.new = false;
        this.inProgress = false;
        this.completed = false;
        this.canceled = false;
        this.failed = false;
        console.error('Erro ao consultar admissões.', err);
        this.setMessage('Não foi possível carregar as admissões.', 'error');
      }
    })
  }

  getAdmissionLength(): void {
    const request = {
      status: 'TODOS'
    }

    this._admissionService.getAdmission(request).subscribe({
      next: (res) => {
        this.newCount = 0;
        this.inProgressCount = 0;
        this.completedCount = 0;
        this.failedCount = 0;
        this.canceledCount = 0;

        if (res.result && Array.isArray(res.result)) {
          res.result.forEach((item: any) => {
            switch (item.status) {
              case 'NOVO':
                this.newCount++;
                break;
              case 'EM ANDAMENTO':
                this.inProgressCount++;
                break;
              case 'CONCLUIDO':
                this.completedCount++;
                break;
              case 'REPROVADO':
                this.failedCount++;
                break;
              case 'CANCELADO':
                this.canceledCount++;
                break;
            }
          });
        }
      },
      error: (err) => {
        console.error('Erro ao buscar contagens de admissões:', err);
        this.newCount = 0;
        this.inProgressCount = 0;
        this.completedCount = 0;
        this.failedCount = 0;
        this.canceledCount = 0;
      }
    })
  }

  updateAdmission() {
    this.isUpdating = true;
    const statusButton = this.currentStatus;

    const request = {
      id: this.currentItem.id,
      status: this.updateForm.value.status
    }

    this._admissionService.updateAdmission(request).subscribe({
      next: () => {
        this.updateForm.reset({ status: '' });
        this.isUpdating = false;
        this.isModalEditVisible = false;
        this.setMessage('Admissão atualizada com sucesso!', 'success');
        this.getAdmission(statusButton);
        this.getAdmissionLength();
      },
      error: (error) => {
        this.isUpdating = false;
        this.isModalEditVisible = false;
        console.error(error)
        this.setMessage('Falha ao atualizar admissão! Tente novamente outra hora.', 'error');
      }
    })
  }

  deleteAdmission() {
    this.isDeleting = true;

    const id = this.currentItem.id;
    const statusButton = this.currentStatus;

    this._admissionService.deleteById(id).subscribe({
      next: (res) => {
        this.isDeleting = false;
        this.setMessage('Admissão deletada com sucesso!', 'success');
        this.getAdmission(statusButton);
        this.getAdmissionLength();
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

  // ========== GERENCIAR MODAL ========== //
  toggleBodyVisibility(index: number): void {
    this.isBodyVisible[index] = !this.isBodyVisible[index];
  }

  openModalDelete(item: any): void {
    this.isModalVisible = false;
    this.isModalDeleteVisible = true;
    this.currentItem = item;
  }

  openModalEdit(item: any): void {
    this.currentItem = item;
    this.isModalEditVisible = true;
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
        this.modalTitle = 'Certidão';
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

  closeModalEdit(): void {
    this.isModalEditVisible = false;
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

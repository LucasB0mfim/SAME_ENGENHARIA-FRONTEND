import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TiService } from '../../../core/services/ti.service';
import { TitleService } from '../../../core/services/title.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-ticket',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './manage-ticket.component.html',
  styleUrl: './manage-ticket.component.scss'
})
export class ManageTicketComponent {
  // INJEÇÃO DE DEPENDÊNCIAS //
  private _titleService = inject(TitleService);
  private readonly _tiService = inject(TiService);
  private readonly _dashboardService = inject(DashboardService);

  // VARIÁVEL PARA ABRIR O CORPO DO CARD
  index: number | null = null;

  // VARIÁVEL PARA ARMAZENAR OS DADOS DA API
  item: any[] = [];

  // VARIÁVEL PARA ARMAZENAR O EMAIL DO COLABORADOR
  email: string = '';

  // LISTA VAZIA
  isEmpty: boolean = false;

  // CARREGANDO
  isLoading: boolean = true;

  // MENSAGEM DE SUCESSO
  errorMessage: string = '';
  showError: boolean = false;

  // MENSAGEM DE ERRO
  successMessage: string = '';
  showSuccess: boolean = false;

  // HOOK DE CICLO //

  ngOnInit() {
    this._titleService.setTitle('Gerenciar Chamado');

    this._dashboardService.findAll().subscribe({
      next: (data) => {
        this.email = data.employee.email;
        this.getTickets();
      },
      error: (error) => {
        console.log('Não foi possível carregar os tickets: ', error);
        this.isLoading = false;
      }
    });
  }

  // PEGAR OS TICKETS DO COLABORADOR //

  getTickets() {
    this._tiService.getTicket().subscribe({
      next: (data) => {
        this.item = data.tickets.filter((item: { status: string }) => item.status === 'ABERTO');
        this.isLoading = false;
        this.isEmpty = this.item.length === 0;
      },
      error: (error) => {
        console.error('Não foi possível buscar os tickets: ', error);
        this.isLoading = false;
        this.isEmpty = this.item.length === 0;
      }
    })
  }

  // MÉTODO PARA ABRIR O CARD //

  openCard(cardIndex: number, event?: Event) {
    if (event) event.stopPropagation();

    if (this.index === cardIndex) {
      this.index = null;
    } else {
      this.index = cardIndex;
    }
  }

  // DEFINIR MENSAGEM DE SUCESSO //

  setSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
    this.showError = false;

    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  // DEFINIR MENSAGEM DE ERRO //

  setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    this.showSuccess = false;

    setTimeout(() => {
      this.showError = false;
    }, 5000);
  }

  // MÉTODO PARA ATUALIZAR O TICKET //

  updateTicket() {

  }

  // MÉTODO PARA FORMATAR A DATA //
  formateDate(date: string) {
    if (date === null) return;
    const fullDate = date.split('T')[0];
    const [year, month, day] = fullDate.split('-');
    return `${day}/${month}/${year}`;
  }
}

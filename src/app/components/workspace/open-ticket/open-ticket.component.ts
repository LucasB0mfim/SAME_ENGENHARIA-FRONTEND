import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TiService } from '../../../core/services/ti.service';
import { TitleService } from '../../../core/services/title.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-open-ticket',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './open-ticket.component.html',
  styleUrl: './open-ticket.component.scss'
})
export class OpenTicketComponent implements OnInit {
  // INJEÇÃO DE DEPENDÊNCIAS //
  private _titleService = inject(TitleService);
  private readonly _tiService = inject(TiService);
  private readonly _dashboardService = inject(DashboardService);

  // VARIÁVEL PARA MOSTRAR A TELA DE CRIAÇÃO
  isCreate: boolean = false;

  // VARIÁVEL PARA ABRIR O CORPO DO CARD
  index: number | null = null;

  // VARIÁVEL PARA ARMAZENAR OS DADOS DA API
  item: any[] = [];

  // VARIÁVEL PARA ARMAZENAR O SETOR DO COLABORADOR
  role: string = '';

  // VARIÁVEL PARA ARMAZENAR O EMAIL DO COLABORADOR
  email: string = '';

  // LISTA VAZIA
  isEmpty: boolean = false;

  // CARREGANDO
  isLoading: boolean = true;

  // GERENCIAR BOTÃO DE ENVIAR
  isSend: boolean = false;

  // MENSAGEM DE SUCESSO
  errorMessage: string = '';
  showError: boolean = false;

  // MENSAGEM DE ERRO
  successMessage: string = '';
  showSuccess: boolean = false;

  // FORMULÁRIO //
  ticketForm: FormGroup = new FormGroup({
    subject: new FormControl(''),
    description: new FormControl('')
  })

  // HOOK DE CICLO //

  ngOnInit() {
    this._titleService.setTitle('Abrir Chamado');

    this._dashboardService.findAll().subscribe({
      next: (data) => {
        this.email = data.employee.email;
        this.role = data.employee.role;
        this.getTickets();
      },
      error: (error) => {
        console.log('Não foi possível carregar as informações do colaborador: ', error);
        this.isLoading = false;
      }
    });
  }

  // PEGAR OS TICKETS DO COLABORADOR //

  getTickets() {
    this._tiService.getTicket().subscribe({
      next: (data) => {
        this.item = data.tickets.filter((item: { applicant_email: string }) => item.applicant_email === this.email);
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

  // MÉTODO PARA ABRIR A MODAL //

  manageModal() {
    this.isCreate = !this.isCreate;
    if (this.isCreate === true) {
      this.isEmpty = false
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

  // MÉTODO PARA ENVIAR O TICKET //

  sendTicket() {
    const request = {
      subject: this.ticketForm.value.subject,
      description: this.ticketForm.value.description,
      role: this.role,
      applicant_email: this.email
    }

    if (request.subject.length <= 4) {
      this.setErrorMessage('Digite o assunto do seu chamdo.');
      return;
    } else if (request.description.length === 0) {
      this.setErrorMessage('Digite a descrição do seu chamado.');
      return;
    }

    this.isSend = true;

    this._tiService.sendTicket(request).subscribe({
      next: () => {
        this.setSuccessMessage('Ticket enviado com sucesso.');
        this.isSend = false;
        this.ticketForm.reset();
        this.getTickets();
        this.isCreate = false;
      },
      error: (error) => {
        this.setErrorMessage('Não foi possível enviar o ticket.')
        console.error('Não foi possível enviar o ticket: ', error);
        this.isSend = false;
      }
    })
  }

  // MÉTODO PARA FORMATAR A DATA //
  formateDate(date: string) {
    if (date === null) return;
    const fullDate = date.split('T')[0];
    const [year, month, day] = fullDate.split('-');
    return `${day}/${month}/${year}`;
  }
}

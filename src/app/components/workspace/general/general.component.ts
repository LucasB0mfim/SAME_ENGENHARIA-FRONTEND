import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TitleService } from '../../../core/services/title.service';
import { GeneralService } from '../../../core/services/general.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { FindEmployeesService } from '../../../core/services/find-employees.service';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private readonly _titleService = inject(TitleService);
  private readonly _generalService = inject(GeneralService);
  private readonly _dashboardService = inject(DashboardService);
  private readonly _employeeService = inject(FindEmployeesService);

  // ========== FORMULÁRIOS ========== //
  commentForm: FormGroup = new FormGroup({
    comment: new FormControl('')
  })

  // ========== ESTADOS ========== //
  notices: any[] = [];
  comments: any[] = [];
  birthdays: any[] = [];
  employee: any = {}

  loadingNotice: boolean = false;
  loadingbirthdays: boolean = false;

  isSendComment: boolean = false;

  username = 'Carregando...';
  ilustration = 'assets/images/ilustration-night.gif';

  // ========== HOOK ========== //
  ngOnInit(): void {
    this.getEmployee();
    this._titleService.setTitle('Dashboard');
  }

  // ========== API ========== //
  getEmployee(): void {
    this._dashboardService.findAll().subscribe({
      next: (data) => {
        this.username = data.employee.username;
        this.employee = data.employee;
        this.getNotice();
        this.getComment();
        this.getBirthdays();
      },
      error: (error) => {
        console.error('Erro ao carregar dados do colaborador:', error);
        this.username = 'Colaborador';
      }
    });
  }

  getNotice(): void {
    this.loadingNotice = true;

    this._generalService.findNotice().subscribe({
      next: (data) => {
        this.notices = data.records;
        this.loadingNotice = false;
      },
      error: (error) => {
        console.error('Erro ao buscar as notícias.', error);
        this.loadingNotice = false;
      }
    })
  }

  getComment(): void {
    this._generalService.findComment().subscribe({
      next: (data) => {
        this.comments = data.records;
      },
      error: (error) => {
        console.error('Erro ao buscar as notícias.', error);
      }
    })
  }

  getBirthdays(): void {
    this.loadingbirthdays = true;

    this._employeeService.findEmployees().subscribe({
      next: (data) => {
        const currentMonth = new Date().getMonth();

        this.birthdays = data.employees.filter((employee: any) => {
          const birthday = new Date(employee.birthday);
          return birthday.getMonth() === currentMonth;
        });

        this.loadingbirthdays = false;
      },
      error: (error) => {
        console.error('Erro ao buscar aniversariantes.', error);
        this.loadingbirthdays = false;
      }
    });
  }

  sendComment(): void {
    this.isSendComment = true;

    const request = {
      comment: this.commentForm.value.comment,
      username: this.employee.username,
      avatar: this.employee.avatar,
    }

    this._generalService.sendComment(request).subscribe({
      next: () => {
        this.getComment();
        this.isSendComment = false;
        this.commentForm.reset();
      },
      error: (error) => {
        console.log('Erro ao enviar comentário.', error);
        this.isSendComment = false;
      }
    })
  }

  // ========== UTILITÁRIOS ========== //
  getHours(): string {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Bom dia';
    } else if (hour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  }
}

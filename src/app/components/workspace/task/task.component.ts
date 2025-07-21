import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from '../../../core/services/title.service';
import { AdmissionService } from '../../../core/services/admission.service';

@Component({
  selector: 'app-task',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private readonly _titleService = inject(TitleService)
  private readonly _admissionService = inject(AdmissionService);

  // ========== ESTADOS ========== //
  isLoading: boolean = false;
  isEmpty: boolean = false;
  isGenerate: boolean = false;

  link: string = '';

  showMessage: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  // ========== HOOK ========== //
  ngOnInit(): void {
    this._titleService.setTitle('Tarefas');
  }

  // ========== API ========== //
  generateForm(): void {
    this.isGenerate = true;

    this._admissionService.generateLink().subscribe({
      next: (res) => {
        this.link = res.link;
        this.isGenerate = false;

        navigator.clipboard.writeText(this.link)
          .then(() => {
            this.setMessage('Link gerado e copiado com sucesso!', 'success');
          })
          .catch((err) => {
            this.setMessage('Erro ao copiar o link. Tente novamente.', 'error');
          });
      },
      error: (err) => {
        this.isGenerate = false;
        console.error('Erro ao gerar link:', err);
        this.setMessage('Erro ao gerar o link. Tente novamente.', 'error');
      }
    });
  }

  // ========== AUXILIARES ========== //
  setMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  }
}

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BenefitService } from '../../../core/services/benefit.service';



@Component({
  selector: 'app-task-form',
  imports: [NgxMaskDirective, MatIconModule, CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  providers: [provideNgxMask()],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private readonly _benefitService = inject(BenefitService);

  // ========== ESTADOS ========== //
  isSuccess: boolean = false;
  isError: boolean = false;
  isLoading: boolean = false;

  showForm: boolean = true;

  CC: any[] = [];
  uniqueCC: any[] = [];

  // ========== FORMULÁRIO ========== //
  taskForm: FormGroup = new FormGroup({
  });

  // ========== FORMULÁRIO ========== //
  ngOnInit(): void {
    this.getCC();
  }

  // ========== API ========== //
  sendForm(): void {

  }

  getCC(): void {
    this._benefitService.findAll().subscribe({
      next: (res) => {
        this.CC = res.result;
        this.removeDuplicate();
      },
      error: (error) => {
        console.error('Falha ao buscar dados.', error);
      }
    });
  }

  removeDuplicate(): void {
    const setCC = new Set<string>();

    this.CC.forEach(item => {
      if (item.centro_custo &&
        item.centro_custo.trim() !== '' &&
        item.centro_custo !== 'NÃO CONSTA') {
        setCC.add(item.centro_custo);
      }
    });

    this.uniqueCC = Array.from(setCC).sort();
  }
}

import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { UpdateService } from '../../services/update.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update',
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent {

  loading: boolean = false;

  private readonly _router = inject(Router);
  private readonly _updateService = inject(UpdateService);

  updateForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    currentPassword: new FormControl(''),
    newPassword: new FormControl('')
  });

  update() {
    this.loading = true;
    this._updateService.update(
      this.updateForm.value.username,
      this.updateForm.value.email,
      this.updateForm.value.currentPassword,
      this.updateForm.value.newPassword
    ).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          console.log('Colaborador atualizado com sucesso.');
          this._router.navigate(['login']);
        } else {
          console.log('Não foi possível atualizar:', response.message);
        }
      },
      error: (error) => {
        this.loading = false;
        console.log('Erro ao atualizar colaborador:', error);
      }
    });
  };
};


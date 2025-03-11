import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UpdateService } from '../../core/services/update.service';
import { IUpdateRequest } from '../../core/interfaces/update-request.interface';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent {

  loading: boolean = false;
  updateError: string = '';

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
    this.updateError = '';

    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const request: IUpdateRequest = {
      username: this.updateForm.value.username,
      email: this.updateForm.value.email,
      currentPassword: this.updateForm.value.currentPassword,
      newPassword: this.updateForm.value.newPassword
    };

    this._updateService.update(request).subscribe({
      next: () => {
        this.loading = false;
        this._router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 400) {
          this.updateError = 'Preencha todos os campos';
        } else if (error.status === 401) {
          this.updateError = 'Email ou senha atual incorreto(s)';
        } else if (error.status === 404) {
          this.updateError = 'Email ou senha atual incorreto(s)';
        } else if (error.status === 422) {
          this.updateError = 'A nova senha não atende aos requisitos';
        } else {
          this.updateError = 'Erro interno. Tente novamente outra hora'
        }

        setTimeout(() => {
          this.updateError = '';
        }, 3000);

        console.log(error);
      }
    });
  }
}

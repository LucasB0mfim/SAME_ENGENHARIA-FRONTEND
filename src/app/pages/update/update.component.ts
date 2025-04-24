import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UpdateService } from '../../core/services/update.service';
import { IUpdateRequest } from '../../core/interfaces/update-request.interface';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent {

  loading: boolean = false;
  updateError: string = '';

  currentPasswordType: 'password' | 'text' = 'password';
  newPasswordType: 'password' | 'text' = 'password';

  currentPasswordIcon: 'lock' | 'visibility' | 'visibility_off' = 'lock';
  newPasswordIcon: 'lock' | 'visibility' | 'visibility_off' = 'lock';

  logo = 'assets/images/banner-logo.png';
  backgroundImageUrl = 'assets/images/wallpaper-login.jpg';

  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  passwordRequirements = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  };

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
      this.loading = false;
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

  toggleCurrentPasswordVisibility() {
    if (this.currentPasswordType === 'password') {
      this.currentPasswordType = 'text';
      this.currentPasswordIcon = 'visibility';
    } else {
      this.currentPasswordType = 'password';
      this.currentPasswordIcon = 'visibility_off';
    }
  }

  toggleNewPasswordVisibility() {
    if (this.newPasswordType === 'password') {
      this.newPasswordType = 'text';
      this.newPasswordIcon = 'visibility';
    } else {
      this.newPasswordType = 'password';
      this.newPasswordIcon = 'visibility_off';
    }
  }

  updateCurrentPasswordIcon() {
    const currentPasswordValue = this.updateForm.get('currentPassword')?.value;

    if (!currentPasswordValue) {
      this.currentPasswordIcon = 'lock';
    } else {
      this.currentPasswordIcon = this.currentPasswordType === 'password' ? 'visibility' : 'visibility_off';
    }
  }

  updateNewPasswordIcon() {
    const newPasswordValue = this.updateForm.get('newPassword')?.value;

    if (!newPasswordValue) {
      this.newPasswordIcon = 'lock';
    } else {
      this.newPasswordIcon = this.newPasswordType === 'password' ? 'visibility' : 'visibility_off';
    }

    this.checkPasswordRequirements(newPasswordValue);
  }

  checkPasswordRequirements(password: string) {
    this.passwordRequirements = {
      minLength: password?.length >= 8,
      hasUpperCase: /[A-Z]/.test(password || ''),
      hasLowerCase: /[a-z]/.test(password || ''),
      hasNumber: /\d/.test(password || ''),
      hasSpecialChar: /[@$!%*?&]/.test(password || '')
    };
  }

  validatePassword(control: FormControl) {
    const value = control.value;

    if (!value) return null;

    this.checkPasswordRequirements(value);

    const isValid = this.passwordRequirements.minLength &&
      this.passwordRequirements.hasUpperCase &&
      this.passwordRequirements.hasLowerCase &&
      this.passwordRequirements.hasNumber &&
      this.passwordRequirements.hasSpecialChar;

    return isValid ? null : { invalidPassword: true };
  }
}

import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';

import { FirstLoginService } from '../../core/services/fisrt-login.service';
import { ILoginRequest } from '../../core/interfaces/login-request.interface';

@Component({
  selector: 'app-first-login',
  imports: [MatProgressSpinnerModule, MatIconModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './first-login.component.html',
  styleUrl: './first-login.component.scss'
})
export class FirstLoginComponent {
  logo = 'assets/images/banner-logo.png';
  backgroundImageUrl = 'assets/images/wallpaper-login.jpg';

  loading: boolean = false;
  loginError: string = '';
  firstLoginError: string = '';

  passwordType: 'password' | 'text' = 'password';
  showPasswordIcon: 'lock' | 'visibility' | 'visibility_off' = 'lock';

  private readonly _router = inject(Router);
  private readonly _firstLoginService = inject(FirstLoginService)

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  togglePasswordVisibility() {
    if (this.loginForm.get('password')?.value) {
      if (this.passwordType === 'password') {
        this.passwordType = 'text';
        this.showPasswordIcon = 'visibility';
      } else if (this.passwordType === 'text') {
        this.passwordType = 'password';
        this.showPasswordIcon = 'visibility_off';
      }
    }
  }

  updatePasswordIcon() {
    const passwordValue = this.loginForm.get('password')?.value;

    if (!passwordValue) {
      this.showPasswordIcon = 'lock';
      this.passwordType = 'password';
    } else {
      this.showPasswordIcon = 'visibility';
    }
  }

  firstLogin() {
    this.loading = true;
    this.firstLoginError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const request: ILoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }

    this._firstLoginService.login(request).subscribe({
      next: () => {
        this.loading = false;
        this._router.navigate(['update']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;

        if (error.status === 400) {
          this.firstLoginError = 'Preencha todos os campos';
        } else if (error.status === 401) {
          this.firstLoginError = 'Email ou senha incorreto(s)';
        } else if (error.status === 404) {
          this.firstLoginError = 'O colaborador não foi encontrado';
        } else {
          this.firstLoginError = 'Erro interno. Tente outra hora'
        }

        setTimeout(() => {
          this.firstLoginError = '';
        }, 3000);

        console.error(error);
      }
    })
  }
}

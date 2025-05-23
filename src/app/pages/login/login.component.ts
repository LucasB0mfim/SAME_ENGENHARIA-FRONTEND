import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoginService } from '../../core/services/login.service'

import { ILoginRequest } from '../../core/interfaces/login-request.interface';

@Component({
  selector: 'app-login',
  imports: [MatProgressSpinnerModule, MatIconModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  logo = 'assets/images/logo-white.png';
  backgroundImageUrl = 'assets/images/login-banner.gif';

  loading: boolean = false;
  loginError: string = '';
  firstLoginError: string = '';

  passwordType: 'password' | 'text' = 'password';
  showPasswordIcon: 'lock' | 'visibility' | 'visibility_off' = 'lock';

  private readonly _router = inject(Router);
  private readonly _loginService = inject(LoginService);

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

  login() {

    this.loading = true;
    this.loginError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const request: ILoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }

    this._loginService.login(request).subscribe({
      next: () => {
        this.loading = false;
        this._router.navigate(['dashboard']);
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 400) {
          this.loginError = 'Preencha todos os campos';
        } else if (error.status === 401) {
          this.loginError = 'Email ou senha incorreto(s)';
        } else if (error.status === 404) {
          this.loginError = 'Email ou senha incorreto(s)';
        } else {
          this.loginError = 'Erro interno. Tente novamente outra hora'
        }

        setTimeout(() => {
          this.loginError = '';
        }, 3000);

        console.error(error);
      }
    })
  }
}

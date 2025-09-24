import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { LoginService } from '../../core/services/login.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private readonly _router = inject(Router);
  private readonly _loginService = inject(LoginService);

  // ========== FORMULÁRIOS ========== //
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', Validators.required)
  });

  // ========== ESTADOS ========== //
  isLogin: boolean = false;

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  // ========== API ========== //
  onSubmit(): void {
    this.isLogin = true;

    const request = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.senha
    }

    this._loginService.login(request)
      .pipe(finalize(() => this.isLogin = false))
      .subscribe({
        next: (res) => {
          this.setMessage(res.message, 'success');
          this._router.navigate(['dashboard']);
        },
        error: (err) => {
          console.error('Erro ao solicitar acesso: ', err);
          this.setMessage(err.erro.message, 'error');
        }
      });
  }

  // ========== CAMPO INVÁLIDO ========== //
  isInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!field && field.invalid && field.touched;
  }

  // ========== MENSAGEM ========== //
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

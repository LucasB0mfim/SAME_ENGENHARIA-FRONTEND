import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import { LoginService } from '../../services/login.service'

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('container') container!: ElementRef;
  @ViewChild('registerbtn') registerbtn!: ElementRef;
  @ViewChild('loginbtn') loginbtn!: ElementRef;;

  ngAfterViewInit() {
    this.registerbtn.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.add('active');
    });

    this.loginbtn.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.remove('active');
    });
  }

  private readonly _router = inject(Router);
  private readonly _loginService = inject(LoginService);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  login() {
    this._loginService.login(this.loginForm.value.email, this.loginForm.value.senha)
      .subscribe({
        next: () => {
          this._router.navigate(['']);
        },
        error: (error) => {
          if (error.status === 401) {
            this.loginForm.setErrors({ 'crediciaisInvalidas': true });
          } else {
            this.loginForm.setErrors({ 'erroInesperado': true });
          }
        }
      });
  }
}

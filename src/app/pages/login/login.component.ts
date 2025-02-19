import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import { LoginService } from '../../services/login.service'
import { FirstLoginService } from '../../services/fisrt-login.service';

@Component({
  selector: 'app-login',
  imports: [MatProgressSpinnerModule, CommonModule, ReactiveFormsModule],
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

  loading: boolean = false;

  private readonly _router = inject(Router);
  private readonly _loginService = inject(LoginService);
  private readonly _firstLoginService = inject(FirstLoginService)

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  login() {
    this.loading = true;
    this._loginService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: () => {
          this.loading = false;
          this._router.navigate(['dashboard']);

        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao logar: ', error);
        }
      });
  }

  firstLogin() {
    this._firstLoginService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: () => {
          this.loading = false;
          this._router.navigate(['update']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao realizar o primeiro login: ', error);
        }
      });
  }
}

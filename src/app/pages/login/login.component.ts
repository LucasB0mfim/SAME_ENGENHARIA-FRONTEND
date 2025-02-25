import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import { LoginService } from '../../services/login.service'
import { FirstLoginService } from '../../services/fisrt-login.service';
import { ILoginRequest } from '../../interfaces/login-request.interface';

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
        console.error(error)
      }
    })
  }

  firstLogin() {
    const request: ILoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }

    this._firstLoginService.login(request).subscribe({
      next: () => {
        this.loading = false;
        this._router.navigate(['login']);
      },
      error: (error) => {
        this.loading = false;
        console.error(error);
      }
    })
  }
}

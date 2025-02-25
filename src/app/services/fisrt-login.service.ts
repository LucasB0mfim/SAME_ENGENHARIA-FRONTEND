import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ILoginRequest } from '../interfaces/login-request.interface';
import { ILoginResponse } from '../interfaces/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class FirstLoginService {

  private readonly _httpClient = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _apiUrl = 'http://localhost:3000/same-engenharia/api/employee/firstLogin';

  login(request: ILoginRequest): Observable<ILoginResponse> {
    return this._httpClient.post<ILoginResponse>(this._apiUrl, request);
  }
}

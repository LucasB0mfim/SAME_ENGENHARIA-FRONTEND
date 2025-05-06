import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { IEmployeeResponse } from '../interfaces/employee-response.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = 'http://192.168.10.17:3000/same-engenharia/api/employee';

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  findAll(): Observable<IEmployeeResponse> {
    const headers = this._createHeaders();
    return this._httpClient.get<IEmployeeResponse>(this._apiUrl, {headers});
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IEmployeesResponse } from '../interfaces/employees-response.interface';

@Injectable({
  providedIn: 'root'
})
export class FindEmployeesService {
  private readonly _htppClient = inject(HttpClient);
  private readonly _apiUrl = 'http://localhost:3000/same-engenharia/api/employees';

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  findEmployees(): Observable<IEmployeesResponse> {
    const headers = this._createHeaders();
    return this._htppClient.get<IEmployeesResponse>(this._apiUrl, {headers});
  }
}

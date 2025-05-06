import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { IOrderResponse } from '../interfaces/order-response.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly _httpClient = inject(HttpClient);
  private _apiUrl = 'http://192.168.10.17:3000/same-engenharia/api/reports/request';

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  findAll(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(this._apiUrl, {headers});
  }

  update(formData: FormData): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.put<any>(this._apiUrl, formData, {headers});
  }

  updateStatus(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.put<any>('http://192.168.10.17:3000/same-engenharia/api/order/update', request, {headers})
  }

  managerOrder(request: any): Observable<IOrderResponse> {
    const headers = this._createHeaders();
    return this._httpClient.put<IOrderResponse>(this._apiUrl, request, {headers})
  }
}

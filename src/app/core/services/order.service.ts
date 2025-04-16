import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IOrderResponse } from '../interfaces/order-response.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly _httpClient = inject(HttpClient);
  private _apiUrl = 'http://192.168.10.17:3000/same-engenharia/api/reports/request';

  findAll(): Observable<any> {
    return this._httpClient.get<any>(this._apiUrl);
  }

  update(formData: FormData): Observable<any> {
    return this._httpClient.put<any>(this._apiUrl, formData);
  }

  updateStatus(request: any): Observable<any> {
    return this._httpClient.put<any>('http://192.168.10.17:3000/same-engenharia/api/order/update', request)
  }

  managerOrder(request: any): Observable<IOrderResponse> {
    return this._httpClient.put<IOrderResponse>(this._apiUrl, request)
  }
}

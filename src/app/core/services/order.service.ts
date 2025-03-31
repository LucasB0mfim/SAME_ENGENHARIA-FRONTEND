import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IManagerOrderRequest, IOrderResponse } from '../interfaces/order-response.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly _httpClient = inject(HttpClient);
  private _apiUrl = 'http://192.168.10.17:3000/same-engenharia/api/reports/request';

  find(): Observable<IOrderResponse> {
    return this._httpClient.get<IOrderResponse>(this._apiUrl);
  }

  update(formData: FormData): Observable<IOrderResponse> {
    return this._httpClient.put<IOrderResponse>(this._apiUrl, formData);
  }

  managerOrder(request: any): Observable<IOrderResponse> {
    return this._httpClient.put<IOrderResponse>(this._apiUrl, request)
  }
}

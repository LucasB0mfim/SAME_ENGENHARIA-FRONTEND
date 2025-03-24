import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { IRequestResponse } from '../interfaces/request-response.interface';
import { IOrderRequest } from '../interfaces/order-request.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private readonly _httpClient = inject(HttpClient);
  private _apiUrl = 'http://localhost:3000/same-engenharia/api/reports/request';

  find(): Observable<IRequestResponse> {
    return this._httpClient.get<IRequestResponse>(this._apiUrl);
  }

  update(formData: FormData): Observable<IRequestResponse> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data'); // Adiciona o header para FormData

    return this._httpClient.put<IRequestResponse>(this._apiUrl, formData, { headers });
  }
}

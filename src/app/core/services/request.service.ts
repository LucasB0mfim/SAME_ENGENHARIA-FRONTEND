import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { IRequestResponse } from '../interfaces/order-response.interface';

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
    return this._httpClient.put<IRequestResponse>(this._apiUrl, formData);
  }
}

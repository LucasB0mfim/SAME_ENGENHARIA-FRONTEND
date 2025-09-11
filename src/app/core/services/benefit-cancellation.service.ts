import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { IUpdateRequest } from '../interfaces/update-request.interface';
import { IUpdateResponse } from '../interfaces/update-response.interface';

@Injectable({
  providedIn: 'root'
})
export class BenefitCancellationService {
  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.')
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  create(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/employee', request, { headers });
  }
}

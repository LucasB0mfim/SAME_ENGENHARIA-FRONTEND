import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { IUpdateRequest } from '../interfaces/update-request.interface';
import { IUpdateResponse } from '../interfaces/update-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = 'http://44.203.74.199:3000/same-engenharia/api/employee';

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.')
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  update(request: IUpdateRequest): Observable<IUpdateResponse> {
    const headers = this._createHeaders();
    return this._httpClient.put<IUpdateResponse>(this._apiUrl, request, {headers});
  }
}

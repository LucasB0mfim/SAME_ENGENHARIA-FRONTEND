import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUpdateResponse } from '../interfaces/update-response.interface';
import { IUpdateRequest } from '../interfaces/update-request.interface';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = 'http://206.42.34.79:3000/same-engenharia/api/employee';

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

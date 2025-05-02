import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ITrackingResponse } from '../interfaces/tracking-response.interface';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = 'http://54.146.211.211:3000/same-engenharia/api/reports/tracking';

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  findAll(): Observable<ITrackingResponse> {
    const headers = this._createHeaders();
    return this._httpClient.get<ITrackingResponse>(this._apiUrl, {headers});
  }
}

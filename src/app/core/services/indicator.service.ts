import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = 'http://44.203.74.199:3000/same-engenharia/api/indicators/cost-center';

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  findCostCenter(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(this._apiUrl, {headers});
  }
}

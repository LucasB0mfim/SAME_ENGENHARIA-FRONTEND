import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BenefitService {

  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = 'http://192.168.10.17:3000/same-engenharia/api/reports/benefit';

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  findAll(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(this._apiUrl, { headers });
  }

  sendDate(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>(this._apiUrl, request, { headers });
  }
}

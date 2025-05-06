import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TiService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = 'http://192.168.10.17:3000/same-engenharia/api/ti/tickets';

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.')
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTicket(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(this._apiUrl, {headers});
  }

  sendTicket(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>(this._apiUrl, request, {headers});
  }

  updateTicket(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.put<any>(this._apiUrl, request, {headers});
  }
}

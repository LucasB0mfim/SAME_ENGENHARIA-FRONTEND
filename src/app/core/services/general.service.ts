import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  findNotice(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>('http://44.203.74.199:3000/same-engenharia/api/notice', { headers });
  }

  findComment(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>('http://44.203.74.199:3000/same-engenharia/api/comment', { headers });
  }

  sendComment(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('http://44.203.74.199:3000/same-engenharia/api/comment', request, { headers });
  }
}

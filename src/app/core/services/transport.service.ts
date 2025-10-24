import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class TransportService {
  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  };

  findAll(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>('https://sameengenharia.com.br/api/transport/', { headers });
  };

  findByStatus(status: string): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(`https://sameengenharia.com.br/api/transport/${status}`, { headers });
  };

  update(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.put<any>(`https://sameengenharia.com.br/api/transport`, request, { headers });
  };
}

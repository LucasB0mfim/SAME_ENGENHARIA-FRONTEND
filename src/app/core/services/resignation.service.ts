import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResignationService {
  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  findAll() {
    const headers = this._createHeaders();
    return this._httpClient.get<any>('https://sameengenharia.com.br/api/resignation', { headers });
  }

  findByStatus(status: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(`https://sameengenharia.com.br/api/resignation/${status}`, { headers });
  }

  create(request: any) {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/resignation', request, { headers });
  }

  update(request: any) {
    const headers = this._createHeaders();
    return this._httpClient.put<any>('https://sameengenharia.com.br/api/resignation', request, { headers });
  }

  delete(id: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.delete<any>(`https://sameengenharia.com.br/api/resignation/${id}`, { headers });
  }
}

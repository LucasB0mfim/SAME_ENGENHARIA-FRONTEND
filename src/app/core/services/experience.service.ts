import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  find(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>('https://sameengenharia.com.br/api/experience/reports', { headers });
  }

  updateModality(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.put<any>('https://sameengenharia.com.br/api/experience/update', request, { headers });
  }

  getExcel(): Observable<Blob> {
    const headers = this._createHeaders();
    return this._httpClient.get('https://sameengenharia.com.br/api/experience/download', {
      headers,
      responseType: 'blob' as 'blob'
    });
  }
}

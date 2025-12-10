import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaryMeasureService {
  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  };

  findAll(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>('https://sameengenharia.com.br/api/disciplinary-measure/', { headers });
  };

  findByStatus(status: string): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(`https://sameengenharia.com.br/api/disciplinary-measure/${status}`, { headers });
  };

  update(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.put<any>(`https://sameengenharia.com.br/api/disciplinary-measure`, request, { headers });
  };

  delete(id: number): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.delete<any>(`https://sameengenharia.com.br/api/disciplinary-measure/${id}`, { headers });
  };

  download(id: number) {
    const headers = this._createHeaders();
    return this._httpClient.get(`https://sameengenharia.com.br/api/disciplinary-measure/download/${id}`, {
      headers,
      responseType: 'blob',
      observe: 'response'
    });
  }
}

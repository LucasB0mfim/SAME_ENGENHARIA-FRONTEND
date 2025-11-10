import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {
  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  generateLink() {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/admission/generate-link', null, { headers });
  };

  create(formData: FormData): Observable<any> {
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/admission', formData);
  };

  findByStatus(status: string): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(`https://sameengenharia.com.br/api/admission/${status}`, { headers });
  };

  update(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.put<any>('https://sameengenharia.com.br/api/admission', request, { headers });
  };

  download(id: number) {
    const headers = this._createHeaders();
    return this._httpClient.get(`https://sameengenharia.com.br/api/admission/download/${id}`, {
      headers,
      responseType: 'blob',
      observe: 'response'
    });
  }
}

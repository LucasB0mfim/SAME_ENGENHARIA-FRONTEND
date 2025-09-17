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
  }

  sendForm(formData: FormData): Observable<any> {
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/admission/create', formData);
  }

  getAdmission(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/admission/find', request, { headers });
  }

  updateAdmission(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.put<any>('https://sameengenharia.com.br/api/admission/update', request, { headers });
  }

  deleteById(id: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.delete<any>(`https://sameengenharia.com.br/api/admission/delete/${id}`, { headers });
  }

  generatePdf(id: number) {
    const headers = this._createHeaders();
    return this._httpClient.get(`https://sameengenharia.com.br/api/admission/generate-pdf/${id}`, {
      headers,
      responseType: 'blob',
      observe: 'response'
    });
  }


}

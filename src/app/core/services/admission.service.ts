import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = 'https://sameengenharia.com.br/api/admission/create';

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  sendForm(formData: FormData): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>(this._apiUrl, formData, { headers });
  }
}

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BenefitService {

  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  findMedia(data: any, centro_custo: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>('https://sameengenharia.com.br/api/benefit/media', {
      headers,
      params: {
        data,
        centro_custo
      }
    });
  };

  findMonth(data: any, centro_custo: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>('https://sameengenharia.com.br/api/benefit/month', {
      headers,
      params: {
        data,
        centro_custo
      }
    });
  };

  createMonth(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/benefit/month', request, { headers });
  };

  deleteMonth(month: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.delete<any>(`https://sameengenharia.com.br/api/benefit/month/:${month}`, { headers });
  };

  deleteEmployee(id: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.delete<any>(`https://sameengenharia.com.br/api/benefit/employee/:${id}`, { headers });
  };

  donwloadLayoutVr(request: any): Observable<Blob> {
    const headers = this._createHeaders();
    return this._httpClient.post('https://sameengenharia.com.br/api/benefit/donwload/layout-vr', request, {
      responseType: 'blob' as 'blob',
      headers
    });
  };

  donwloadLayoutCaju(request: any): Observable<Blob> {
    const headers = this._createHeaders();
    return this._httpClient.post('https://sameengenharia.com.br/api/benefit/donwload/layout-caju', request, {
      responseType: 'blob' as 'blob',
      headers
    });
  };

  donwloadLayoutVem(request: any): Observable<Blob> {
    const headers = this._createHeaders();
    return this._httpClient.post('https://sameengenharia.com.br/api/benefit/donwload/layout-vem', request, {
      responseType: 'blob' as 'blob',
      headers
    });
  };
}

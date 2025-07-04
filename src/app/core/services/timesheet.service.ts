import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  findAll(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get('https://sameengenharia.com.br/api/reports/timesheets', {headers})
  }

  findByFilter(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post('https://sameengenharia.com.br/api/reports/timesheet/filters', request, {headers})
  }

  upload(formData: FormData): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post('https://sameengenharia.com.br/api/reports/csv', formData, {headers})
  }

  uploadExtraDay(formData: FormData): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post('https://sameengenharia.com.br/api/reports/extra-day', formData, {headers})
  }

  donwloadLayoutTOTVS(request: any): Observable<Blob> {
    const headers = this._createHeaders();
    return this._httpClient.post('https://sameengenharia.com.br/api/timesheet/download/layout', request, {
      responseType: 'blob' as 'blob',
      headers
    });
  }
}

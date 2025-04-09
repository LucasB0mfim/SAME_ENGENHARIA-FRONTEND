import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
    return this._httpClient.get('http://192.168.10.17:3000/same-engenharia/api/reports/timesheets')
  }

  upload(formData: FormData): Observable<any> {
    return this._httpClient.post('http://192.168.10.17:3000/same-engenharia/api/reports/csv`', formData)
  }
}

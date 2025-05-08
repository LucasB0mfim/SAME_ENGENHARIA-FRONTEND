import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  findAll(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>('http://192.168.10.17:3000/same-engenharia/api/benefit/employee', { headers });
  }

  createEmployee(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('http://192.168.10.17:3000/same-engenharia/api/benefit/employee', request, { headers });
  }

  updateEmployee(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.put<any>('http://192.168.10.17:3000/same-engenharia/api/benefit/employee', request, { headers });
  }

  deleteEmployee(id: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.delete<any>(`http://192.168.10.17:3000/same-engenharia/api/benefit/employee/${id}`, { headers });
  }

  findRecord(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('http://192.168.10.17:3000/same-engenharia/api/benefit/find-report', request, { headers });
  }

  createRecord(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('http://192.168.10.17:3000/same-engenharia/api/benefit/create-report', request, { headers });
  }
}

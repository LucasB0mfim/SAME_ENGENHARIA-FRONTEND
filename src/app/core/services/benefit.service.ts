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

  findAll(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>('http://localhost:3000/benefit/employee', { headers });
  }

  createEmployee(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('http://localhost:3000/benefit/employee', request, { headers });
  }

  updateEmployee(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.put<any>('http://localhost:3000/benefit/employee', request, { headers });
  }

  deleteEmployee(id: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.delete<any>(`http://localhost:3000/benefit/employee/${id}`, { headers });
  }

  findRecord(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('http://localhost:3000/benefit/find-report', request, { headers });
  }

  getBenefitMedia(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('http://localhost:3000/test', request, { headers });
  }

  createRecord(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('http://localhost:3000/benefit/create-report', request, { headers });
  }

  updateRecord(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('http://localhost:3000/benefit/update', request, { headers });
  }

  getTxt(request: any): Observable<Blob> {
    return this._httpClient.post('http://localhost:3000/benefit/txt', request, {
      responseType: 'blob' as 'blob'
    });
  }

  stateHolidays(state: string, year: string): Observable<any> {
    return this._httpClient.get<any>(
      `https://feriados-brasileiros1.p.rapidapi.com/read_uf?estado=${state}&ano=${year}`,
      {
        headers: {
          'x-rapidapi-key': '2166c88048msh1f7f56a1376afa1p1c65c8jsn21a0af250681',
          'x-rapidapi-host': 'feriados-brasileiros1.p.rapidapi.com'
        }
      }
    );
  }

  cityHolidays(city: string, state: string, year: string): Observable<any> {
    return this._httpClient.get<any>(
      `https://feriados-brasileiros1.p.rapidapi.com/read?cidade=${city}&estado=${state}&ano=${year}`,
      {
        headers: {
          'x-rapidapi-key': '2166c88048msh1f7f56a1376afa1p1c65c8jsn21a0af250681',
          'x-rapidapi-host': 'feriados-brasileiros1.p.rapidapi.com'
        }
      }
    );
  }
}

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
    return this._httpClient.get<any>('https://sameengenharia.com.br/api/benefit/employee', { headers });
  }

  createEmployee(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/benefit/employee', request, { headers });
  }

  updateEmployee(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.put<any>('https://sameengenharia.com.br/api/benefit/employee', request, { headers });
  }

  deleteEmployee(id: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.delete<any>(`https://sameengenharia.com.br/api/benefit/employee/${id}`, { headers });
  }

  deleteEmployeeRecord(id: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.delete<any>(`https://sameengenharia.com.br/api/benefit/employee/delete/record/${id}`, { headers });
  }

  findRecord(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/benefit/find-report', request, { headers });
  }

  getBenefitMedia(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/benefit/medias', request, { headers });
  }

  createRecord(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/benefit/create-report', request, { headers });
  }

  updateRecord(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/benefit/update', request, { headers });
  }

  donwloadLayoutVr(request: any): Observable<Blob> {
    const headers = this._createHeaders();
    return this._httpClient.post('https://sameengenharia.com.br/api/benefit/donwload/layout-vr', request, {
      responseType: 'blob' as 'blob',
      headers
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

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ITimeSheetResponse } from '../interfaces/timesheet-response.interface';

@Injectable({
  providedIn: 'root'
})
export class TimesheetReportService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = 'http://206.42.34.79:3000/same-engenharia/api/reports/timeheet';

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getEmployeeTimesheet(employeeName: string): Observable<ITimeSheetResponse> {
    const headers = this._createHeaders();
    const body = { name: employeeName.toUpperCase() };
    return this._httpClient.post<ITimeSheetResponse>(this._apiUrl, body, { headers });
  }
}

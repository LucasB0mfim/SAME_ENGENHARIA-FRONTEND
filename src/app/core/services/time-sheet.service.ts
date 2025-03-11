import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ITimeSheetRequest } from '../interfaces/timesheet-request.interface';
import { ITimeSheetResponse } from '../interfaces/timesheet-response.interface';

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = 'http://localhost:3000/same-engenharia/api/reports/timeheet/filters';

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  find(request: ITimeSheetRequest): Observable<ITimeSheetResponse> {
    const headers = this._createHeaders();
    return this._httpClient.post<ITimeSheetResponse>(this._apiUrl, request, { headers });
  }

  getEmployeeTimesheet(
    employeeName: string,
    startDate?: string,
    endDate?: string,
    status?: string,
    abono?: string
  ): Observable<ITimeSheetResponse> {
    const headers = this._createHeaders();

    // Monta o corpo da requisição com todos os filtros disponíveis
    const body: any = {
      name: employeeName.toUpperCase()
    };

    // Adiciona os filtros opcionais quando fornecidos
    if (startDate) {
      body.startDate = startDate;
    }

    if (endDate) {
      body.endDate = endDate;
    }

    if (status && status !== 'all') {
      body.status = status;
    }

    if (abono && abono !== 'none') {
      body.abono = abono;
    }

    return this._httpClient.post<ITimeSheetResponse>(this._apiUrl, body, { headers });
  }
}

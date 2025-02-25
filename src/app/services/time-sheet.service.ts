import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ITimeSheetResponse } from '../interfaces/time-sheet.interface';

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = 'http://localhost:3000/same-engenharia/api/reports/timeheets';

  findAll(): Observable<ITimeSheetResponse> {
    return this._httpClient.get<ITimeSheetResponse>(this._apiUrl)
  }
}

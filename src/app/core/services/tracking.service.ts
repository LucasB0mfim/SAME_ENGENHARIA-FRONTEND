import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ITrackingResponse } from '../interfaces/tracking-response.interface';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = 'http://localhost:3000/same-engenharia/api/reports/tracking';

  findAll(): Observable<ITrackingResponse> {
    return this._httpClient.get<ITrackingResponse>(this._apiUrl);
  }
}

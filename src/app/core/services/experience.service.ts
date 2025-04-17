import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { IExperienceResponse } from '../interfaces/experience-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = 'http://192.168.10.17:3000/same-engenharia/api/reports/experience';

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  find(): Observable<IExperienceResponse> {
    const headers = this._createHeaders();
    return this._httpClient.get<IExperienceResponse>(this._apiUrl, {headers});
  }
}

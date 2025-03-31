import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IExperienceResponse } from '../interfaces/experience-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = 'http://192.168.10.17:3000/same-engenharia/api/reports/experience';

  find(): Observable<IExperienceResponse> {
    return this._httpClient.get<IExperienceResponse>(this._apiUrl);
  }
}

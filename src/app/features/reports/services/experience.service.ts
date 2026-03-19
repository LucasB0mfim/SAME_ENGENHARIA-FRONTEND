import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private readonly _url = environment.apiUrl;
  private readonly _httpClient = inject(HttpClient);

  findByStatus(status: any) {
    return this._httpClient.get<any>(`${this._url}/experience/${status}`);
  }
}

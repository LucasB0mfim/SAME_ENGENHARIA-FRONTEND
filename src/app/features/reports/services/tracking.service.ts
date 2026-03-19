import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private readonly _url = environment.apiUrl;
  private readonly _httpClient = inject(HttpClient);

  findAll() {
    return this._httpClient.get<any>(`${this._url}/tracking`);
  }
}

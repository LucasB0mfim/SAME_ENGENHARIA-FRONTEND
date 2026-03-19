import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private readonly _url = environment.apiUrl;
  private readonly _httpClient = inject(HttpClient);

  find() {
    return this._httpClient.get<any>(`${this._url}/experience/reports`);
  }

  updateModality(request: any) {
    return this._httpClient.put<any>(`${this._url}/experience/update`, request);
  }

  getExcel(): Observable<Blob> {
    return this._httpClient.get(`${this._url}/experience/download`, {
      responseType: 'blob' as 'blob'
    });
  }
}

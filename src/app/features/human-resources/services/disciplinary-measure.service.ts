import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaryMeasureService {
  private readonly _url = environment.apiUrl;
  private readonly _httpClient = inject(HttpClient);

  findAll() {
    return this._httpClient.get<any>(`${this._url}/disciplinary-measure`);
  };

  findByStatus(status: string) {
    return this._httpClient.get<any>(`${this._url}/disciplinary-measure/status`, {
      params: { status }
    });
  }

  countByStatus() {
    return this._httpClient.get<any>(`${this._url}/admission/status/count`);
  }

  update(request: any) {
    return this._httpClient.put<any>(`${this._url}/disciplinary-measure`, request);
  };

  delete(id: number) {
    return this._httpClient.delete<any>(`${this._url}/disciplinary-measure/${id}`);
  };

  download(id: number) {
    return this._httpClient.get(`${this._url}/disciplinary-measure/download/${id}`, {
      responseType: 'blob',
      observe: 'response'
    });
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {
  private readonly _url = environment.apiUrl;
  private readonly _httpClient = inject(HttpClient);

  generateLink() {
    return this._httpClient.get<any>(`${this._url}/admission/generate-link`);
  }

  create(formData: FormData) {
    return this._httpClient.post<any>(`${this._url}/admission`, formData);
  }

  findByStatus(status: string) {
    return this._httpClient.get<any>(`${this._url}/admission/${status}`);
  }

  update(request: any) {
    return this._httpClient.put<any>(`${this._url}/admission`, request);
  }

  delete(id: number) {
    return this._httpClient.delete<any>(`${this._url}/admission/${id}`);
  }

  download(id: number) {
    return this._httpClient.get(`${this._url}/admission/download/pdf/${id}`, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  excel() {
    return this._httpClient.get(`${this._url}/admission/download/excel`, {
      responseType: 'blob',
      observe: 'response'
    });
  }
}

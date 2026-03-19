import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TransportService {
  private readonly _url = environment.apiUrl;
  private readonly _httpClient = inject(HttpClient);

  findAll() {
    return this._httpClient.get<any>(`${this._url}/transport`);
  };

  findByStatus(status: string) {
    return this._httpClient.get<any>(`${this._url}/transport/${status}`);
  };

  update(request: any) {
    return this._httpClient.put<any>(`${this._url}/transport`, request);
  };

  download(id: number) {
    return this._httpClient.get(`${this._url}/transport/download/${id}`, {
      responseType: 'blob',
      observe: 'response'
    });
  }
}

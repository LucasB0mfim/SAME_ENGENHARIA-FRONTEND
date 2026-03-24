import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrkService {
  private readonly _url = environment.apiUrl;
  private readonly _httpClient = inject(HttpClient);

  findByStatus(status: string) {
    return this._httpClient.get<any>(`${this._url}/brk/status`, {
      params: { status }
    });
  }

  countByStatus() {
    return this._httpClient.get<any>(`${this._url}/brk/status/count`);
  }

  create(request: any) {
    return this._httpClient.post<any>(`${this._url}/brk`, request);
  }

  update(request: any) {
    return this._httpClient.put<any>(`${this._url}/brk`, request);
  }

  delete(id: number) {
    return this._httpClient.delete<any>(`${this._url}/brk/${id}`);
  }
}

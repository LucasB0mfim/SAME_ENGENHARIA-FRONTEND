import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly _url = environment.apiUrl;
  private readonly _httpClient = inject(HttpClient);

  create(formData: FormData) {
    return this._httpClient.post<any>(`${this._url}/invoice`, formData);
  }

  findByStatus(status: string) {
    return this._httpClient.get<any>(`${this._url}/invoice/status`, {
      params: { status }
    });
  }

  countByStatus() {
    return this._httpClient.get<any>(`${this._url}/invoice/status/count`);
  }

  update(request: any) {
    return this._httpClient.put<any>(`${this._url}/invoice`, request);
  }

  delete(id: number) {
    return this._httpClient.delete<any>(`${this._url}/invoice/${id}`);
  }
}

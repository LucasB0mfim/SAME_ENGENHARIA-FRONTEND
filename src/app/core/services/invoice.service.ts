import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly _url = environment.apiUrl;
  private readonly _httpClient = inject(HttpClient);

  create(formData: FormData) {
    return this._httpClient.post<any>(`${this._url}/invoice`, formData);
  }
}

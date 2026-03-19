import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResignationService {
  private readonly _url = environment.apiUrl;
  private readonly _httpClient = inject(HttpClient);

  findAll() {
    return this._httpClient.get<any>(`${this._url}/resignation`);
  }

  findByStatus(status: any) {
    return this._httpClient.get<any>(`${this._url}/resignation/${status}`);
  }

  create(request: any) {
    return this._httpClient.post<any>(`${this._url}/resignation`, request);
  }

  update(request: any) {
    return this._httpClient.put<any>(`${this._url}/resignation`, request);
  }

  delete(id: any) {
    return this._httpClient.delete<any>(`${this._url}/resignation/${id}`);
  }
}

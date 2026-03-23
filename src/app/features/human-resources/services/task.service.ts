import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly _url = environment.apiUrl;
  private readonly _httpClient = inject(HttpClient);

  findByStatus(status: string) {
    return this._httpClient.get<any>(`${this._url}/task/status`, {
      params: { status }
    });
  }

  countByStatus() {
    return this._httpClient.get<any>(`${this._url}/admission/status/count`);
  }

  update(request: any) {
    return this._httpClient.put<any>(`${this._url}/task`, request);
  }
}

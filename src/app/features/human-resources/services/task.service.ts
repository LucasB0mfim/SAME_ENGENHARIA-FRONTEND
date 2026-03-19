import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly _url = environment.apiUrl;
  private readonly _httpClient = inject(HttpClient);

  findByStatus(status: any) {
    return this._httpClient.get<any>(`${this._url}/task/status/${status}`);
  }

  update(request: any) {
    return this._httpClient.put<any>(`${this._url}/task`, request);
  }
}

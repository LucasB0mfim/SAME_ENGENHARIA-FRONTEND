import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly _url = environment.apiUrl;
  private readonly _httpClient = inject(HttpClient);

  findEmployees() {
    return this._httpClient.get<any>(`${this._url}/employee`);
  };

  findActiveCostCenters() {
    return this._httpClient.get<any>(`${this._url}/employee/cost-centers`);
  };

  findActiveNames() {
    return this._httpClient.get<any>(`${this._url}/employee/names`);
  };

  findFunctions() {
    return this._httpClient.get<any>(`${this._url}/employee/functions`);
  };

  dashboard() {
    return this._httpClient.get<any>(`${this._url}/employee/dashboard`);
  };
}

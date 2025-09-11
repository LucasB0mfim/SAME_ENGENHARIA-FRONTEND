import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EquipmentRentalService {
  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  findByStatus(status: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(`https://sameengenharia.com.br/api/equipment-rental/${status}`, { headers });
  }

  findByContract(numero_contrato: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(`https://sameengenharia.com.br/api/equipment-rental/contract/${numero_contrato}`, { headers });
  }

  register(formData: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/equipment-rental/register', formData, { headers });
  }

  active(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.put<any>('https://sameengenharia.com.br/api/equipment-rental/active', request, { headers });
  }

  renew(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.put<any>('https://sameengenharia.com.br/api/equipment-rental/renew', request, { headers });
  }

  archive(idmov: number): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.put<any>(`https://sameengenharia.com.br/api/equipment-rental/${idmov}`, null, { headers });
  }
}

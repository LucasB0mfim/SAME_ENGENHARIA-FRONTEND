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

  findByIdmov(idmov: any) {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(`https://sameengenharia.com.br/api/equipment-rental/${idmov}`, { headers });
  }

  findByStatus(status: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(`https://sameengenharia.com.br/api/equipment-rental/${status}`, { headers });
  }

  rentalReturn(idmov: number): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>(`https://sameengenharia.com.br/api/equipment-rental/${idmov}`, null, { headers });
  }

  renew(request: any) {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/equipment-rental/renew', request, { headers });
  }
}

// src/app/services/dashboard.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly _httpClient = inject(HttpClient);

  getEmployeeData(): Observable<{ name: string, function: string }> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this._httpClient.get<{ success: boolean, message: string, data: { name: string, function: string } }>(
      'http://localhost:3000/same-engenharia/api/employee/info',
      { headers }
    ).pipe(
      map(response => response.data) // Extrai os dados do colaborador da resposta
    );
  }
}

// src/app/services/dashboard.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly _httpClient = inject(HttpClient);

  getEmployeeData(): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token não encontrado');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this._httpClient.get<any>(
      'http://localhost:3000/same-engenharia/api/employee', {headers}
    ).pipe(
      map(response => response.employee)
    );
  }
}

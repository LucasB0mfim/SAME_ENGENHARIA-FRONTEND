import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

// Definindo a interface para a resposta do backend
interface TimeSheetResponse {
  success: boolean;
  message: string;
  records: {
    PERIODO: string;
    CHAPA: number | null;
    NOME: string;
    JORNADA_REALIZADA: string;
    FALTA: string;
    EVENTO_ABONO: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService {
  private readonly _httpClient = inject(HttpClient);

  records(): Observable<TimeSheetResponse['records']> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token não encontrado');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this._httpClient.get<TimeSheetResponse>(
      'http://localhost:3000/same-engenharia/api/reports/timeheets',
      { headers }
    ).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.records;
      })
    );
  }
}

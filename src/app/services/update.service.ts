import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  private readonly _httpClient = inject(HttpClient);

  update(
    username: string,
    email: string,
    currentPassword: string,
    newPassword: string
  ): Observable<{ success: boolean, message: string, token: string }> {

    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token não encontrado');
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    const body = {
      username,
      email,
      currentPassword,
      newPassword
    };

    return this._httpClient.put<{ success: boolean, message: string, token: string }>(
      'http://localhost:3000/same-engenharia/api/employee',
      body,
      { headers }
    ).pipe(
      map((response) => {
        console.log('Token recebido:', response.token);
        localStorage.setItem('token', response.token);
        return response;
      })
    );
  };
};

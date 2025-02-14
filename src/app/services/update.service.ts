import { HttpClient } from '@angular/common/http';
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
    return this._httpClient.put<{ success: boolean, message: string, token: string }>(
      'http://localhost:3000/same-engenharia/api/employee/update',
      { username, email, currentPassword, newPassword }
    ).pipe(
      map((response) => {
        console.log('Token recebido:', response.token);
        localStorage.setItem('token', response.token);
        return response;
      })
    );
  };
};

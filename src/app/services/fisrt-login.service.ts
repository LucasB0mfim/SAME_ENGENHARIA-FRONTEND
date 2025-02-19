import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirstLoginService {

  private readonly _httpClient = inject(HttpClient);
  private readonly _router = inject(Router);

  login(email: string, password: string): Observable<{ success: boolean, message: string, token: string }> {
    return this._httpClient.post<{ success: boolean, message: string, token: string }>(
      'https://sameengenharia-backend-production.up.railway.app/same-engenharia/api/employee/firstLogin',
      { email, password }
    ).pipe(
      map((response) => {
        console.log('Token recebido:', response.token);
        localStorage.setItem('token', response.token);
        return response;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }
}

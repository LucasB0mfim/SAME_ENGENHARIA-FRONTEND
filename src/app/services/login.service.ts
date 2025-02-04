import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly _httpClient = inject(HttpClient);

  login(email: string, senha: string): Observable<{ token: string }> {
    return this._httpClient.post<{ token: string }>('http://localhost:3000/same-engenharia/login', {
      email,
      senha
    }).pipe(map((tokenResponse) => {
      localStorage.setItem('token', tokenResponse.token);
      return tokenResponse;
    }));
  }
}

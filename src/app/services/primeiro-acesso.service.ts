import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrimeiroAcessoService {
  private readonly _httpClient = inject(HttpClient);

  primeiroAcesso(email: string, senha: string): Observable<{ token: string }> {
    return this._httpClient.post<{ token: string }>('http://localhost:3000/same-engenharia/api/colaborador/primeiro-acesso', {
      email,
      senha
    }).pipe(map((tokenResponse) => {
      localStorage.setItem('token', tokenResponse.token);
      return tokenResponse;
    }));
  }
}

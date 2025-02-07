import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  private readonly _httpClient = inject(HttpClient);

  cadastro(usuario: string, email: string, senhaAtual: string, senhaNova: string): Observable<{ token: string }> {
    return this._httpClient.post<{ token: string }>('http://localhost:3000/same-engenharia/api/colaborador/primeiro-acesso', {
      usuario,
      email,
      senhaAtual,
      senhaNova
    }).pipe(map((tokenResponse) => {
      localStorage.setItem('token', tokenResponse.token);
      return tokenResponse;
    }));
  }
}

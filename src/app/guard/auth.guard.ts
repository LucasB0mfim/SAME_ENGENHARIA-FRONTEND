// src/app/guards/auth.guard.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const _httpClient = inject(HttpClient);
  const _router = inject(Router);
  const token = localStorage.getItem('token');

  console.log('Token no authGuard:', token); // Log do token

  if (!token) {
    console.log('Token não encontrado, redirecionando para /login'); // Log de redirecionamento
    _router.navigate(['/login']);
    return false;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  console.log('Fazendo requisição para validar o token...'); // Log da requisição

  return _httpClient.post<{ email: string, message: string }>(
    'http://localhost:3000/same-engenharia/api/validateToken',
    {},
    { headers }
  ).pipe(
    map(response => {
      console.log('Resposta do backend:', response); // Log da resposta
      if (response.message === 'Token válido') {
        console.log('Token válido, permitindo acesso à dashboard'); // Log de sucesso
        return true;
      } else {
        console.log('Token inválido, redirecionando para /login'); // Log de falha
        _router.navigate(['/login']);
        return false;
      }
    }),
    catchError((error) => {
      console.error('Erro na requisição:', error); // Log de erro
      _router.navigate(['/login']);
      return of(false);
    })
  );
};

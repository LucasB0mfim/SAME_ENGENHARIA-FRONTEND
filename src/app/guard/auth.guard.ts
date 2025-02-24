import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const _httpClient = inject(HttpClient);
  const _router = inject(Router);
  const token = localStorage.getItem('token');

  console.log('Token no authGuard:', token);

  if (!token) {
    console.log('Token não encontrado.');
    _router.navigate(['/login']);
    return false;
  }

  const body = '';

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return _httpClient.post<any>(
    'http://localhost:3000/same-engenharia/api/auth/validate-token', {body}, {headers}
  ).pipe(
    map(response => {
      if (response.message === 'Token Válido.') {
        console.log('Token válido. Acesso liberado!');
        return true;
      } else {
        console.log('Token inválido. Acesso negado!');
        _router.navigate(['/login']);
        return false;
      }
    }),
    catchError((error) => {
      console.error('Erro na requisição:', error);
      _router.navigate(['/login']);
      return of(false);
    })
  );
};

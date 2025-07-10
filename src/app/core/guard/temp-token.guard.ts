import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

export const tempTokenGuard: CanActivateFn = (route, state) => {

  const _router = inject(Router);
  const _httpClient = inject(HttpClient);

  const token = route.queryParamMap.get('token');

  if (!token) {
    console.warn('Token não encontrado na URL.');
    _router.navigate(['/unauthorized']);
    return of(false);
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return _httpClient.post<any>(
    'https://sameengenharia.com.br/api/auth/validate-token', {}, { headers }).pipe(
      map(response => {
        if (response.success) {
          return true;
        } else {
          _router.navigate(['/unauthorized']);
          return false;
        }
      }),
      catchError(error => {
        console.error('Erro ao validar token:', error);
        _router.navigate(['/unauthorized']);
        return of(false);
      })
    );
};

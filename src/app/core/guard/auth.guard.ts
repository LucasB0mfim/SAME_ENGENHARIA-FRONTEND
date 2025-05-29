import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { IValidateTokenResponse } from '../interfaces/validateToken-response.interface';

export const authGuard: CanActivateFn = (route, state) => {

  function _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  const body = '';
  const _router = inject(Router);
  const headers = _createHeaders();
  const _httpClient = inject(HttpClient);
  const _apiUrl = 'https://sameengenharia.com.br/api/auth/validate-token';

  return _httpClient.post<IValidateTokenResponse>(_apiUrl, body, {headers}).pipe(
    map(response => {
      if (response.success) {
        return true
      } else {
        _router.navigate(['/login']);
        console.log('Token inválido ou expirado.')
        return false;
      }
    })
  )
}

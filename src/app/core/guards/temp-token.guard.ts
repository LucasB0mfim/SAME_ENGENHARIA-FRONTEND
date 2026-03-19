import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const tempTokenGuard: CanActivateFn = (route, state) => {

  const _router = inject(Router);
  const _httpClient = inject(HttpClient);
  const _url = environment.apiUrl;
  const token = route.queryParamMap.get('token');

  if (!token) {
    console.warn('Token não encontrado na URL.');
    _router.navigate(['/unauthorized']);
    return of(false);
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return _httpClient.post<any>( `${_url}/user/auth-token`, {}, { headers }).pipe(
      map(response => {
        if (response.success) {
          return true;
        } else {
          _router.navigate(['/unauthorized']);
          return false;
        }
      })
    );
};

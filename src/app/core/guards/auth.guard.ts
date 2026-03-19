import { inject } from '@angular/core';
import { catchError, map, of, switchMap } from 'rxjs';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = () => {
  const _router = inject(Router);
  const _httpClient = inject(HttpClient);
  const _userService = inject(UserService);

  return _httpClient.post<any>(`${environment.apiUrl}/user/auth-token`, {}).pipe(
    switchMap(response => {
      if (!response.success) {
        _router.navigate(['/login']);
        return of(false);
      }
      return _userService.load().pipe(map(() => true));
    }),
    catchError(() => {
      _router.navigate(['/login']);
      return of(false);
    })
  );
};

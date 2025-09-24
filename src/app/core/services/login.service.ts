import { map } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly _httpClient = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _apiUrl = 'https://sameengenharia.com.br/api/user/login';

  login(request: any) {
    return this._httpClient.post<any>(this._apiUrl, request).pipe(
      map((response) => {

        if (response.success) {
          localStorage.setItem('token', response.token);
        }

        return response;
      })
    )
  }

  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }
}

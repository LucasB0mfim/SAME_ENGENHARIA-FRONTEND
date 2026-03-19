import { map } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _userService = inject(UserService);
  private readonly _url = environment.apiUrl;

  login(request: any) {
    return this._httpClient.post<any>(`${this._url}/user/login/username`, request).pipe(
      map(response => {
        if (response.success) {
          localStorage.setItem('token', response.token);
        }
        return response;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._userService.clear();
    this._router.navigate(['/login']);
  }
}

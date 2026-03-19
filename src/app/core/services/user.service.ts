import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _url = environment.apiUrl;
  private readonly _httpClient = inject(HttpClient);
  private readonly _user = new BehaviorSubject<any>(null);

  user$ = this._user.asObservable();

  load() {
    return this._httpClient.get<any>(`${this._url}/user`).pipe(
      tap(response => {
        if (response.success) {
          this._user.next(response.result);
        }
      })
    );
  }

  getUser() {
    return this._user.getValue();
  }

  clear() {
    this._user.next(null);
  }
}

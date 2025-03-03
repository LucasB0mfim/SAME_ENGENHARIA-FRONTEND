import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Usar BehaviorSubject para que novos assinantes recebam o valor atual imediatamente
  private themeSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('theme') === 'dark'
  );

  // Método para obter o estado atual do tema e inscrever-se para mudanças
  getThemeState(): Observable<boolean> {
    return this.themeSubject.asObservable();
  }

  // Método para atualizar o estado do tema
  setThemeState(isDark: boolean): void {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    this.themeSubject.next(isDark);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private titleSubject = new BehaviorSubject<string>('Dashboard');

  // Observable para que componentes possam se inscrever em mudanças de título
  public title$: Observable<string> = this.titleSubject.asObservable();

  // Método para atualizar o título
  setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  // Método para obter o título atual
  getCurrentTitle(): string {
    return this.titleSubject.getValue();
  }
}

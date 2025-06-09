import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  logo: string = 'assets/images/logo-orange.png'

  menuAtivo = false;

  toggleMenu() {
    this.menuAtivo = !this.menuAtivo;
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  logo: string = '/assets/images/logo.png';
  inhire: string = 'https://same-engenharia.inhire.app/vagas/c88453e5-110d-435d-ba33-e4a911a16fa4/banco-de-talentos-same-engenharia'
}

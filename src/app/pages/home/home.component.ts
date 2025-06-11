import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  menuAtivo = false;

  logo: string = 'assets/images/logo-orange.png';
  logoWhite: string = 'assets/images/logo-white.png';
  instagram: string = '/assets/images/instagram.png';
  linkedin: string = '/assets/images/linkedin.png';
  whatsapp: string = '/assets/images/whatsapp.png';

  inhireUrl: string = 'https://same-engenharia.inhire.app/vagas/c88453e5-110d-435d-ba33-e4a911a16fa4/banco-de-talentos-same-engenharia';
  linkedinUrl: string = 'https://www.linkedin.com/company/same-engenharia/';
  instagramUrl: string = 'https://www.instagram.com/sameengenharia/';
  whatsappUrl: string = 'https://contate.me/sameengenharia/';

  realEstateImage1: string = 'assets/images/trator1.jpg';
  realEstateImage2: string = 'assets/images/trator2.jpg';


  brk: string = 'assets/images/obra_brk.jpg';
  franciscoAreias: string = 'assets/images/obra_francisco-areias.jpg';
  irmaDenize: string = 'assets/images/obra_irma-denize.jpg';

  readonly anoAtual = new Date().getFullYear();

  toggleMenu() {
    this.menuAtivo = !this.menuAtivo;
  }
}

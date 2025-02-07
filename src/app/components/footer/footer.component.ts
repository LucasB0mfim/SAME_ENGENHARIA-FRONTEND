import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  logo: string = 'images/logo.png';
  instagram: string = 'images/instagram.png';
  linkedin: string = 'images/linkedin.png';
  whatsapp: string = 'images/whatsapp.png';
  whatsappQrCode: string = 'images/qrcode.png';

  linkedinUrl: string = 'https://www.linkedin.com/company/same-engenharia/';
  instagramUrl: string = 'https://www.instagram.com/sameengenharia/';
  whatsappUrl: string = 'https://contate.me/sameengenharia/';

  readonly anoAtual = new Date().getFullYear();
}

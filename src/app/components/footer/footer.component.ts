import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  logo: string = 'assets/images/logo.png';
  instagram: string = 'assets/images/instagram.png';
  linkedin: string = 'assets/images/linkedin.png';
  whatsapp: string = 'assets/images/whatsapp.png';
  whatsappQrCode: string = 'assets/images/qrcode.png';

  linkedinUrl: string = 'https://www.linkedin.com/company/same-engenharia/';
  instagramUrl: string = 'https://www.instagram.com/sameengenharia/';
  whatsappUrl: string = 'https://contate.me/sameengenharia/';

  readonly anoAtual = new Date().getFullYear();
}

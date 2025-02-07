import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-botao',
  templateUrl: './whatsapp-botao.component.html',
  styleUrl: './whatsapp-botao.component.scss'
})
export class WhatsappBotaoComponent {
  whatsapp: string = '/assets/images/whatsapp.png';
  whatsappUrl: string = 'https://contate.me/sameengenharia/';
}

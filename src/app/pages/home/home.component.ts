import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../components/public/footer/footer.component";
import { HeaderComponent } from "../../components/public/header/header.component";
import { WhatsappBotaoComponent } from "../../components/public/whatsapp-botao/whatsapp-botao.component";
import { BannerComponent } from "../../components/public/banner/banner.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, FooterComponent, HeaderComponent, WhatsappBotaoComponent, BannerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
}

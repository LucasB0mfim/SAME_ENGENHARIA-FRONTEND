import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from "../carousel/carousel.component";
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { WhatsappBotaoComponent } from "../whatsapp-botao/whatsapp-botao.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, CarouselComponent, FooterComponent, HeaderComponent, WhatsappBotaoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  video: string = 'assets/videos/banner.mp4';
}

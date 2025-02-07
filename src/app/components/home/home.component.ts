import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { WhatsappBotaoComponent } from "../whatsapp-botao/whatsapp-botao.component";
import { HotelCarouselComponent } from "../hotel-carousel/hotel-carousel.component";
import { BannerComponent } from "../banner/banner.component";
import { NovidadeCarouselComponent } from "../novidade-carousel/novidade-carousel.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, FooterComponent, HeaderComponent, WhatsappBotaoComponent, HotelCarouselComponent, BannerComponent, NovidadeCarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  especialistas: string = 'images/especialistas.webp';
}

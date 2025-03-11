import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../components/public/footer/footer.component";
import { HeaderComponent } from "../../components/public/header/header.component";
import { WhatsappBotaoComponent } from "../../components/public/whatsapp-botao/whatsapp-botao.component";
import { HotelCarouselComponent } from "../../components/public/hotel-carousel/hotel-carousel.component";
import { BannerComponent } from "../../components/public/banner/banner.component";
import { NovidadeCarouselComponent } from "../../components/public/novidade-carousel/novidade-carousel.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, FooterComponent, HeaderComponent, WhatsappBotaoComponent, HotelCarouselComponent, BannerComponent, NovidadeCarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  especialistas: string = '/assets/images/especialistas.webp';
}

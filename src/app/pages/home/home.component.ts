import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderComponent } from "../../components/header/header.component";
import { WhatsappBotaoComponent } from "../../components/whatsapp-botao/whatsapp-botao.component";
import { HotelCarouselComponent } from "../../components/hotel-carousel/hotel-carousel.component";
import { BannerComponent } from "../../components/banner/banner.component";
import { NovidadeCarouselComponent } from "../../components/novidade-carousel/novidade-carousel.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, FooterComponent, HeaderComponent, WhatsappBotaoComponent, HotelCarouselComponent, BannerComponent, NovidadeCarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  especialistas: string = '/assets/images/especialistas.webp';
}

import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-novidade-carousel',
  imports: [CarouselModule],
  templateUrl: './novidade-carousel.component.html',
  styleUrl: './novidade-carousel.component.scss'
})
export class NovidadeCarouselComponent {
  frente: string = 'images/frente.webp';
  sala: string = 'images/sala.webp';
  quarto: string = 'images/quarto.webp';
  varanda: string = 'images/varanda.webp';

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['＜', '＞'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }
}

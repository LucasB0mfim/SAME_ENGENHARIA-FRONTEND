import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-hotel-carousel',
  imports: [CarouselModule],
  templateUrl: './hotel-carousel.component.html',
  styleUrl: './hotel-carousel.component.scss'
})
export class HotelCarouselComponent {

  hotel1: string = 'images/hotel1.webp';
  hotel2: string = 'images/hotel2.webp';
  hotel3: string = 'images/hotel3.webp';
  hotel4: string = 'images/hotel4.webp';
  hotel5: string = 'images/hotel5.webp';
  hotel6: string = 'images/hotel6.webp';
  hotel7: string = 'images/hotel7.webp';
  hotel8: string = 'images/hotel8.webp';
  hotel9: string = 'images/hotel9.webp';
  hotel10: string = 'images/hotel10.webp';
  hotel11: string = 'images/hotel11.webp';

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

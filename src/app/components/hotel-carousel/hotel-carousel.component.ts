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

  hotel1: string = 'assets/images/hotel1.webp';
  hotel2: string = 'assets/images/hotel2.webp';
  hotel3: string = 'assets/images/hotel3.webp';
  hotel4: string = 'assets/images/hotel4.webp';
  hotel5: string = 'assets/images/hotel5.webp';
  hotel6: string = 'assets/images/hotel6.webp';
  hotel7: string = 'assets/images/hotel7.webp';
  hotel8: string = 'assets/images/hotel8.webp';
  hotel9: string = 'assets/images/hotel9.webp';
  hotel10: string = 'assets/images/hotel10.webp';
  hotel11: string = 'assets/images/hotel11.webp';

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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from "../carousel/carousel/carousel.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  logo: string = 'assets/images/logo.png';
  poster: string = 'assets/images/poster.jpg';
  video: string = 'assets/video/banner.mp4';
}

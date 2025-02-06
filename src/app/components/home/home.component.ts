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
  video: string = 'banner.mp4';
}

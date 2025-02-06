import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  logo: string = 'logo.png';
  // videoUrl: string = 'https://github.com/LucasB0mfim/SAME_ENGENHARIA-VIDEO/raw/refs/heads/main/same.mp4';
  videoUrl: string = 'banner.mp4';
  isVideoLoaded: boolean = false;

  onVideoLoad() {
    this.isVideoLoaded = true;
  }
}

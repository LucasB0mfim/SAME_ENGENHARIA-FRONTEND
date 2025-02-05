import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  wallpaper: string = 'wallpaper.jpg';
  logo: string = 'logo.png';
  video: string = 'same.mp4';
  isVideoLoaded: boolean = false;

  ngOnInit() {
    // Verifica se o dispositivo é mobile
    const isMobile = window.innerWidth <= 768;

    // Inicia o carregamento do vídeo apenas se não for mobile
    if (!isMobile) {
      this.loadVideo();
    }
  }

  private loadVideo() {
    // Carrega o vídeo usando Intersection Observer
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVideoLoaded = true;
          observer.disconnect();
        }
      });
    }, options);

    // Observa a seção do banner
    const bannerElement = document.querySelector('.banner');
    if (bannerElement) {
      observer.observe(bannerElement);
    }
  }
}

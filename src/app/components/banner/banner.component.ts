// banner.component.ts
import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  @ViewChild('videoRef') videoRef!: ElementRef<HTMLVideoElement>;
  video: string = 'videos/banner.mp4?t=${new Date().getTime()}';

  ngAfterViewInit() {
    if (this.videoRef.nativeElement) {
      this.videoRef.nativeElement.play().catch(err => {
        console.warn('Autoplay bloqueado pelo navegador:', err);
      });
    }
  }
}

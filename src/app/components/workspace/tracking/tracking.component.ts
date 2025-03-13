import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingService } from '../../../core/services/tracking.service';
import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'app-tracking',
  imports: [CommonModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent {
  private readonly _trackingService = inject(TrackingService);
  private _titleService = inject(TitleService);

  tracking: any[] = [];

  ngOnInit(): void {
    this.findTracking();
    this._titleService.setTitle('Rastreamento de Pedidos')
  }

  findTracking(): void {
    this._trackingService.findAll().subscribe({
      next: (response) => {
        this.tracking = response.tracking;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}

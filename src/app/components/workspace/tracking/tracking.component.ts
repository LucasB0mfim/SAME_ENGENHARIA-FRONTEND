import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingService } from '../../../core/services/tracking.service';


@Component({
  selector: 'app-tracking',
  imports: [CommonModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent {
  private readonly _trackingService = inject(TrackingService);

  tracking: any[] = [];

  ngOnInit(): void {
    this.findTracking();
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

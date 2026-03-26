import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toast',
  imports: [MatIconModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit {
  @Input() type: string | null = null;
  @Input() message: string | null = null;
  @Output() close = new EventEmitter<void>();

  private timeoutId: any;

  ngOnInit(): void {
    this.timeoutId = setTimeout(() => {
      this.dimiss();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  dimiss(): void {
    this.close.emit();
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() username: string = '';
  @Input() avatar: string = '';
  @Input() isDarkTheme: boolean = false;

  @Output() toggleTheme = new EventEmitter<void>();

  onToggleTheme(): void {
    this.toggleTheme.emit();
  }
}

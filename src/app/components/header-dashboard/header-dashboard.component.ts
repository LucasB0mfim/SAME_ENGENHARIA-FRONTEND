import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './header-dashboard.component.html',
  styleUrl: './header-dashboard.component.scss'
})
export class HeaderDashboardComponent {
  @Input() username: string = '';
  @Input() avatar: string = '';
  @Input() isDarkTheme: boolean = false;
  @Input() isMenuOpen: boolean = false;

  @Output() toggleMenu = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }

  onToggleTheme(): void {
    this.toggleTheme.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }
}

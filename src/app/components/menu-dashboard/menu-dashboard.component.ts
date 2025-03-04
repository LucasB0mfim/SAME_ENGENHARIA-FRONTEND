import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './menu-dashboard.component.html',
  styleUrl: './menu-dashboard.component.scss'
})
export class MenuDashboardComponent {
  @Output() logout = new EventEmitter<void>();

  onLogout(): void {
    this.logout.emit();
  }
}

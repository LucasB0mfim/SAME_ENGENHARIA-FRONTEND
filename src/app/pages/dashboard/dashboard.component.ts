import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Dashboard';
  userName: string = 'Lucas';
  isDarkTheme: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Se inscrever nas mudanças de tema
    this.themeService.getThemeState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDarkTheme = isDark;
        this.applyTheme(isDark);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleTheme(): void {
    const newTheme = !this.isDarkTheme;
    this.themeService.setThemeState(newTheme);
  }

  private applyTheme(isDark: boolean): void {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }
}

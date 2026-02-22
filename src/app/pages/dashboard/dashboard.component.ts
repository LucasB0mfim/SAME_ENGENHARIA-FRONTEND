import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';
import { TitleService } from '../../core/services/title.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { LoginService } from '../../core/services/login.service';

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
  title: string = 'Dashboard';
  avatar: string = 'https://placehold.co/40x40';
  isDarkTheme: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private _themeService: ThemeService,
    private readonly _titleService: TitleService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _userService: DashboardService,
    private readonly _loginService: LoginService
  ) { }

  ngOnInit(): void {
    this._themeService.getThemeState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDarkTheme = isDark;
        this.applyTheme(isDark);
      });

    this._titleService.title$
      .pipe(takeUntil(this.destroy$))
      .subscribe(title => {
        this.title = title;
        this._cdr.detectChanges();
      });

    this._userService.findAll().subscribe({
      next: (res) => {
        this.avatar = res.result.avatar;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleTheme(): void {
    const newTheme = !this.isDarkTheme;
    this._themeService.setThemeState(newTheme);
  }

  onLogout(): void {
    this._loginService.logout();
  }

  private applyTheme(isDark: boolean): void {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }
}
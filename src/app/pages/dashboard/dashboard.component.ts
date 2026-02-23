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
  avatar: string = '';
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
        this.avatar = res.result.avatar || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADZ0lEQVR4nO1Z30tUQRT+sF8kgpqlD1r9BQU9JAX9G6Jk+JaisjNefdjyZd9UyBTR0OhPMIPa7N0/Qdke+92TpkFgqaAnztwLtbt3u2fm3msb7YEDl9273znfzJmZb84CNatZzWIbdeEEadwkhXFSWCGN16SxQxoHge+QQsF8x+9kcINyqPv7iY/iIilMkcJn0iBL/0Qak5RBx/EnnsEF0nhMCvsOiRe7MhiLNIrzx5O8wm1S2I6deLl/IYWe9BLvxylSeJJC4lQyI0scK+nk60nhlUUiu6TwnBQeksaMeebP5L9f5ZhJjrw0+SPSmCaNpjIcjSZDxn9HMhMvE5kJi7I5ohH0CvDuiEloLMZLfgS9FtM+bTEosxa43e5bpXy32Q0rm4rYg2gmhe/CUtqiYbTYE+B9Xr5zvLDG5xrX4ll4ZAeeQYflIfXAgQDvUNIB2ieFSzbgUxbJW9W/EwFtfFIuzGy1TfolRKTwUSQAjaq0Gxn7RezhnHgR69/cQ6dkZMYdCLDPiAkozDnFULgnAV9xJHDEh1QkvkafxUFGJQSWJQQKjgR8EiwXBtFcoWzmnJPXhsCGhEB8qezXdz7QPux5p5rXZbhbEgLxLynp+d5/QWC7ChKlOCVUqGICG9EENJ5VMYFlCYH7DuA/SGHN6Bu+9GdwzQhCD2eN8zN/xt/5V8w1rmeyj5ONJsBNJxnYQaBn+iiLxkjg0jhZNAaH2mrQ/JLMwPVo4BzqgqZTJZBD0zmwkbdRMYdwOegzHf6BwAdxN890zMKT/0oKt5JKvNQY28QIjz2B2BcaiZiKaRS+BvfIQ7st0GIIAS+1zAPjGCEE5mFr3Ks07b5ioPek0GYNJo2p0GZiFMfcZCHoCtgTMhrrNIbWVJJX2AiJ1xUXeCkE9C15uJJg8ldJ4V1IyS4k01r09+ryw0sjSzmcdsbO4EywaMMOtTzlcDI2gYBEfQUSPEpvSOMuDaFBjDeEBlLoNzMZvufnE2vulsxE+c70i8g31iqkMWBO8zG0mhFm52e/WTBAGk/Nu5VxFhIb+VAiGt2m3WevY6J8M/aCFZMYRgu3+xwFWfkhpTHvvFXGIuKh3cgObjrZJs6/UZiwPmFTIcIC0EMnSw2zDng/55ud39PcD25568EaybKqrIq/WWtWM/z79hMgDT9nzbW8QQAAAABJRU5ErkJggg==";
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

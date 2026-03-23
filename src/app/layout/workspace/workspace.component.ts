import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../core/services/theme.service';
import { TitleService } from '../../core/services/title.service';
import { UserService } from '../../core/services/user.service';
import { LoginService } from '../../core/services/login.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

type GroupKey = 'reports' | 'hr';

const GROUP_ROUTES: Record<GroupKey, string[]> = {
  reports: [
    '/workspace/reports/experience',
    '/workspace/reports/tracking',
  ],
  hr: [
    '/workspace/human-resources/admission',
    '/workspace/human-resources/resignation',
    '/workspace/human-resources/disciplinary-measure',
    '/workspace/human-resources/brk',
    '/workspace/human-resources/task',
    '/workspace/human-resources/transport',
  ],
};

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss',
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  title: string = 'Dashboard';
  avatar: string = 'assets/images/avatar.png';
  isDarkTheme: boolean = false;

  openGroups: Record<GroupKey, boolean> = {
    reports: false,
    hr: false,
  };

  private destroy$ = new Subject<void>();

  constructor(
    private readonly _router: Router,
    private readonly _themeService: ThemeService,
    private readonly _titleService: TitleService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _userService: UserService,
    private readonly _loginService: LoginService,
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

    this._userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) this.avatar = user.avatar;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleGroup(group: GroupKey): void {
    this.openGroups[group] = !this.openGroups[group];
  }

  isGroupActive(group: GroupKey): boolean {
    const currentUrl = this._router.url;
    return GROUP_ROUTES[group].some(route => currentUrl.startsWith(route));
  }

  onToggleTheme(): void {
    this._themeService.setThemeState(!this.isDarkTheme);
  }

  onLogout(): void {
    this._loginService.logout();
  }

  private applyTheme(isDark: boolean): void {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }
}

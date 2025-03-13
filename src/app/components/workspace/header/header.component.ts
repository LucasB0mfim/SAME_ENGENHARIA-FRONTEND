import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() username: string = '';
  @Input() avatar: string = '';
  @Input() isDarkTheme: boolean = false;

  @Output() toggleTheme = new EventEmitter<void>();
  @Output() toggleMenu = new EventEmitter<void>();

  title: string = 'Dashboard';
  private destroy$ = new Subject<void>();
  private readonly _titleService = inject(TitleService);


  ngOnInit(): void {
    // Se inscrever nas mudanças de título
    this._titleService.title$
      .pipe(takeUntil(this.destroy$))
      .subscribe(title => {
        this.title = title;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleTheme(): void {
    this.toggleTheme.emit();
  }

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }
}

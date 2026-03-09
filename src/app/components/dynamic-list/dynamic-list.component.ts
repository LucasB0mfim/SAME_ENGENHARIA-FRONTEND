import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component, ContentChild, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { DynamicListConfig } from './dynamic-list.models';

@Component({
  selector: 'app-dynamic-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './dynamic-list.component.html',
  styleUrl: './dynamic-list.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DynamicListComponent {

  @Input({ required: true }) config!: DynamicListConfig;
  @Input() items: any[] = [];
  @Input() isSearching = false;

  @ContentChild('cardBody') cardBody!: TemplateRef<any>;

  activeStatus = '';

  get isEmpty(): boolean {
    return !this.isSearching && this.items.length === 0;
  }

  onStatusClick(status: string): void {
    this.activeStatus = status;
    this.config.onStatusChange(status);
  }
}

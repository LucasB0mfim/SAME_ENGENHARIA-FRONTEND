import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-human-resources',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './human-resources.component.html',
  styleUrl: './human-resources.component.scss'
})
export class HumanResourcesComponent {

}

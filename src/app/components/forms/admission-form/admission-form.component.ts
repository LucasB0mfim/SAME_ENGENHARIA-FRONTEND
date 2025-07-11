import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-admission-form',
  imports: [NgxMaskDirective, MatIconModule],
  providers: [provideNgxMask()],
  templateUrl: './admission-form.component.html',
  styleUrl: './admission-form.component.scss'
})
export class AdmissionFormComponent {

  // ========== ESTADOS ==========
  useVT: string = '';
  hasChildren: string = '';
  useBoot: string = '';

  // ========== UTILITÁRIOS ==========
  onManageVT(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.useVT = selectElement.value;
  }

  onManageChildren(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.hasChildren = selectElement.value;
  }

  onManageBoot(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.useBoot = selectElement.value;
  }
}

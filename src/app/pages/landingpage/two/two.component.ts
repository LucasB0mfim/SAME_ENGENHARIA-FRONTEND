import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimationDirective } from './scroll-animation.directive';
import { scrollAnimations } from './scroll-animations';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-two',
  imports: [
    CommonModule,
    ScrollAnimationDirective,
    MatIconModule,
    RouterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './two.component.html',
  styleUrl: './two.component.scss',
  animations: scrollAnimations
})
export class TwoComponent {

  heroVisible = false;
  teamVisible = false;
  sanitationVisible = false;
  pavingVisible = false;
  mapVisible = false;
  localizationVisible = false;
  leadVisible = false;
  hiringVisible = false;
  isScrolled = false;

  @HostListener('window:scroll', [])

  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  leads = [
    { url: '/assets/logo/lead__aena.png', alt: 'Aena Aeroportos' },
    { url: '/assets/logo/lead__bimbo.png', alt: 'Bimbo' },
    { url: '/assets/logo/lead__coca.png', alt: 'Coca Coca Solar' },
    { url: '/assets/logo/lead__votorantim.png', alt: 'Votorantim' },
    { url: '/assets/logo/lead__heineken.png', alt: 'Heineken' },
    { url: '/assets/logo/lead__moura.png', alt: 'Baterias Moura' },
    { url: '/assets/logo/lead__guerdal.png', alt: 'Guerdal' },
    { url: '/assets/logo/lead__brk.png', alt: 'BRK' },
  ]

  sanitations = [
    { icon: 'route', title: 'Rede Coletora' },
    { icon: 'swap_vert', title: 'Linha de Recalque' },
    { icon: 'timeline', title: 'Adutora' },
    { icon: 'water', title: 'Estação de Tratamento de Água' },
    { icon: 'water_damage', title: 'Estação de Tratamento de Esgoto' },
    { icon: 'vertical_align_top', title: 'Estação Elevatória' },
  ]

  pavings = [
    { icon: 'add_road', title: 'Pavimentação Asfáltica' },
    { icon: 'grid_on', title: 'Pavimentação Intertravado' },
    { icon: 'view_quilt', title: 'Pisos de Concreto' },
    { icon: 'construction', title: 'Terraplanagem' },
    { icon: 'water_damage', title: 'Drenagem' },
    { icon: 'traffic', title: 'Sinalização' },
  ]

  onClick(): void {
    window.location.href = 'https://same-engenharia.inhire.app/vagas/c88453e5-110d-435d-ba33-e4a911a16fa4/banco-de-talentos-same-engenharia';
  }

  /**
   * Métodos para atualizar visibilidade de cada seção
   * Chamados pela diretiva quando o elemento entra/sai do viewport
   */
  onHeroVisibilityChange(isVisible: boolean): void {
    this.heroVisible = isVisible;
  }

  onTeamVisibilityChange(isVisible: boolean): void {
    this.teamVisible = isVisible;
  }

  onSanitationVisibilityChange(isVisible: boolean): void {
    this.sanitationVisible = isVisible;
  }

  onPavingVisibilityChange(isVisible: boolean): void {
    this.pavingVisible = isVisible;
  }

  onMapVisibilityChange(isVisible: boolean): void {
    this.mapVisible = isVisible;
  }

  onLocalizationVisibilityChange(isVisible: boolean): void {
    this.localizationVisible = isVisible;
  }

  onLeadVisibilityChange(isVisible: boolean): void {
    this.leadVisible = isVisible;
  }

  onHiringVisibilityChange(isVisible: boolean): void {
    this.hiringVisible = isVisible;
  }
}

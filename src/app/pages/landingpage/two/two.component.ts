import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimationDirective } from './scroll-animation.directive';
import { scrollAnimations } from './scroll-animations';

@Component({
  selector: 'app-two',
  imports: [
    CommonModule,
    ScrollAnimationDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './two.component.html',
  styleUrl: './two.component.scss',
  animations: scrollAnimations
})
export class TwoComponent {

  // Estados de visibilidade para cada seção
  heroVisible = false;
  teamVisible = false;
  sanitationVisible = false;
  pavingVisible = false;
  mapVisible = false;
  localizationVisible = false;
  leadVisible = false;
  hiringVisible = false;

  leads = [
    { url: 'assets/logo/lead__aena.png', alt: 'Aena Aeroportos' },
    { url: 'assets/logo/lead__bimbo.png', alt: 'Bimbo' },
    { url: 'assets/logo/lead__coca.png', alt: 'Coca Coca Solar' },
    { url: 'assets/logo/lead__votorantim.png', alt: 'Votorantim' },
    { url: 'assets/logo/lead__heineken.png', alt: 'Heineken' },
    { url: 'assets/logo/lead__moura.png', alt: 'Baterias Moura' },
    { url: 'assets/logo/lead__guerdal.png', alt: 'Guerdal' },
  ]

  sanitations = [
    { title: 'Pavimentação' },
    { title: 'Piso de concreto' },
    { title: 'Asfalto' },
    { title: 'ETE' },
    { title: 'ETA' },
    { title: 'Estação elevatória' },
    { title: 'Esgoto' },
    { title: 'Linha de água' },
  ]

  works = [
    { url: 'assets/test/silo.png', alt: 'Obra 2' },
    { url: 'assets/test/work.png', alt: 'Obra 2' },
  ]

  processes = [
    {
      title: 'Planejamento Técnico',
      subtitle: 'Estudos preliminares, viabilidade e soluções sob medida para cada cenário.'
    },
    {
      title: 'Execução com Controle',
      subtitle: 'Acompanhamento em campo, cumprimento de normas e controle rigoroso de qualidade.'
    },
    {
      title: 'Entrega Responsável',
      subtitle: 'Obras entregues no prazo, com documentação técnica e responsabilidade legal.'
    }
  ]

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

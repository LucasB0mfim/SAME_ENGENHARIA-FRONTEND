import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimationDirective } from '../home/scroll-animation.directive';
import { scrollAnimations } from '../home/scroll-animations';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

declare const VanillaTilt: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ScrollAnimationDirective,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: scrollAnimations
})
export class HomeComponent implements AfterViewInit {
  heroVisible = false;
  teamVisible = false;
  sanitationVisible = false;
  pavingVisible = false;
  mapVisible = false;
  localizationVisible = false;
  leadVisible = false;
  hiringVisible = false;
  isScrolled = false;
  menuOpen = false;
  isMobile = false;

  urlInHire: string = 'https://same-engenharia.inhire.app/vagas';
  compliance: string = 'https://docs.google.com/forms/u/0/d/1h_UFcDfnbMmu710rZQ4pqF8_B-RnQUFs_7FsP_AREPc/viewform?edit_requested=true';
  currentYear: string = String(new Date().getFullYear());

  constructor() {
    this.checkIfMobile();
  }

  private checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  onClick(): void {
    window.location.href = this.urlInHire;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;

    // Previne scroll quando o menu está aberto
    if (this.menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu(): void {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  ngAfterViewInit(): void {
    VanillaTilt.init(
      document.querySelectorAll('[data-tilt]'),
      {
        glare: true,
        'max-glare': 0.3
      }
    );
  }

  lists = [
    { icon: 'verified_user', title: 'Conformidade total com as Normas Regulamentadoras (NRs)' },
    { icon: 'workspace_premium', title: 'Mais de 10 anos de experiência no setor' },
    { icon: 'engineering', title: 'Equipe técnica altamente especializada' },
    { icon: 'precision_manufacturing', title: 'Equipamentos e maquinário de alto desempenho' },
    { icon: 'request_quote', title: 'Excelente custo-benefício para o seu projeto' },
    { icon: 'support_agent', title: 'Atendimento focado nas necessidades do cliente' },
  ];

  sanitations = [
    { icon: 'route', title: 'Rede Coletora' },
    { icon: 'swap_vert', title: 'Linha de Recalque' },
    { icon: 'timeline', title: 'Adutora' },
    { icon: 'water', title: 'Estação de Tratamento de Água' },
    { icon: 'water_drop', title: 'Estação de Tratamento de Esgoto' },
    { icon: 'vertical_align_top', title: 'Estação Elevatória' },
  ]

  pavings = [
    { icon: 'add_road', title: 'Pavimentação Asfáltica' },
    { icon: 'grid_on', title: 'Pavimentação Intertravado' },
    { icon: 'view_quilt', title: 'Pisos de Concreto' },
    { icon: 'front_loader', title: 'Terraplanagem' },
    { icon: 'oil_barrel', title: 'Drenagem' },
    { icon: 'directions', title: 'Sinalização' },
  ]

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

  /**
   * Métodos para atualizar visibilidade de cada seção
   * Chamados pela diretiva quando o elemento entra/sai do viewport
   * Se for mobile, as animações são desabilitadas mantendo o estado sempre como 'visible'
   */
  onHeroVisibilityChange(isVisible: boolean): void {
    this.heroVisible = this.isMobile ? true : isVisible;
  }

  onTeamVisibilityChange(isVisible: boolean): void {
    this.teamVisible = this.isMobile ? true : isVisible;
  }

  onSanitationVisibilityChange(isVisible: boolean): void {
    this.sanitationVisible = this.isMobile ? true : isVisible;
  }

  onPavingVisibilityChange(isVisible: boolean): void {
    this.pavingVisible = this.isMobile ? true : isVisible;
  }

  onMapVisibilityChange(isVisible: boolean): void {
    this.mapVisible = this.isMobile ? true : isVisible;
  }

  onLocalizationVisibilityChange(isVisible: boolean): void {
    this.localizationVisible = this.isMobile ? true : isVisible;
  }

  onLeadVisibilityChange(isVisible: boolean): void {
    this.leadVisible = this.isMobile ? true : isVisible;
  }

  onHiringVisibilityChange(isVisible: boolean): void {
    this.hiringVisible = this.isMobile ? true : isVisible;
  }
}

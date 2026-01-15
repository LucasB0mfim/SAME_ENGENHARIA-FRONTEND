import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

interface Project {
  category: string;
  title: string;
  description: string;
}

interface Stat {
  icon: SafeHtml;
  value: number;
  currentValue: string;
  suffix: string;
  label: string;
  description: string;
  animated: boolean;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  isHovered: boolean;
}

interface Value {
  icon: SafeHtml;
  title: string;
  description: string;
  isHovered: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    // Fade In Up Animation
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    // Slide In Up Animation
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    // Slide In Left Animation
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    // Scale In Animation
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),

    // Fade In Animation
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 }))
      ])
    ]),

    // Counter Animation
    trigger('countUp', [
      transition('* => *', [
        animate('1.5s ease-out')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  isMenuOpen = false;
  isScrolled = false;
  stats: Stat[] = [];
  values: Value[] = [];

  logo: string = 'assets/logo-'

  projects: Project[] = [
    {
      category: 'Industrial',
      title: 'Complexo Industrial ABC',
      description: 'Galpão de 15.000m² com estrutura metálica'
    },
    {
      category: 'Público',
      title: 'Escola Municipal Centro',
      description: 'Infraestrutura educacional completa'
    },
    {
      category: 'Corporativo',
      title: 'Edifício Empresarial',
      description: '10 pavimentos com padrão AAA'
    },
    {
      category: 'Industrial',
      title: 'Fábrica Automotiva',
      description: 'Planta de produção automatizada'
    },
    {
      category: 'Público',
      title: 'Posto de Saúde Regional',
      description: 'Atendimento de excelência à população'
    },
    {
      category: 'Corporativo',
      title: 'Reforma Centro Comercial',
      description: 'Modernização e retrofit completo'
    }
  ];

  timeline: TimelineItem[] = [
    {
      year: '2003',
      title: 'Fundação da Same Engenharia',
      description: 'Início das atividades focadas em obras industriais de pequeno porte na região metropolitana.',
      isHovered: false
    },
    {
      year: '2008',
      title: 'Primeira Grande Obra Pública',
      description: 'Conquista do primeiro contrato com prefeitura para construção de escola municipal com 2.500m².',
      isHovered: false
    },
    {
      year: '2013',
      title: 'Expansão Corporativa',
      description: 'Entrada no mercado corporativo com obras de retrofit e construção de edifícios comerciais.',
      isHovered: false
    },
    {
      year: '2018',
      title: 'Certificação ISO 9001',
      description: 'Conquista da certificação de qualidade internacional, reforçando nosso compromisso com excelência.',
      isHovered: false
    },
    {
      year: '2023',
      title: 'Projetos Sustentáveis',
      description: 'Implementação de práticas ESG em 100% dos projetos, liderando a transformação verde no setor.',
      isHovered: false
    }
  ];

  constructor(private sanitizer: DomSanitizer) { }

  private counterIntervals: any[] = [];

  ngOnInit(): void {
    this.stats = [
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <path d="M12 2v20"></path>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      `),
        value: 10,
        currentValue: '0',
        suffix: '+',
        label: 'Anos de Experiência',
        description: 'Mais de duas décadas construindo projetos de excelência',
        animated: false
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      `),
        value: 500,
        currentValue: '0',
        suffix: '+',
        label: 'Obras Concluídas',
        description: 'Centenas de projetos entregues com qualidade comprovada',
        animated: false
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      `),
        value: 100,
        currentValue: '0',
        suffix: '%',
        label: 'Clientes Satisfeitos',
        description: 'Índice de satisfação e recomendação comprovado',
        animated: false
      }
    ];

    this.values = [
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      `),
        title: 'Pontualidade',
        description: 'Cumprimento rigoroso de prazos em todas as etapas do projeto',
        isHovered: false
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      `),
        title: 'Qualidade',
        description: 'Padrões elevados de execução e acabamento em cada detalhe',
        isHovered: false
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="M9 12l2 2 4-4"></path>
      `),
        title: 'Segurança',
        description: 'Protocolos rigorosos para proteção de equipes e patrimônio',
        isHovered: false
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      `),
        title: 'Inovação',
        description: 'Tecnologias modernas e soluções criativas para cada desafio',
        isHovered: false
      }
    ];

    this.observeStatsSection();
  }

  ngOnDestroy(): void {
    // Limpar intervalos ao destruir componente
    this.counterIntervals.forEach(interval => clearInterval(interval));
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.isMenuOpen = false;
    }
  }

  onStatAnimationDone(index: number): void {
    // Iniciar animação de contagem quando a animação de entrada termina
    if (!this.stats[index].animated) {
      this.stats[index].animated = true;
      this.animateCounter(index);
    }
  }

  private animateCounter(index: number): void {
    const stat = this.stats[index];
    const duration = 1500; // 1.5 segundos
    const steps = 60;
    const increment = stat.value / steps;
    const stepDuration = duration / steps;
    let currentValue = 0;

    const interval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= stat.value) {
        stat.currentValue = stat.value.toString();
        clearInterval(interval);
      } else {
        stat.currentValue = Math.floor(currentValue).toString();
      }
    }, stepDuration);

    this.counterIntervals.push(interval);
  }

  private observeStatsSection(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Ativar animação dos stats quando visível
            this.stats.forEach((stat, index) => {
              setTimeout(() => {
                stat.animated = true;
                this.animateCounter(index);
              }, index * 200); // Delay escalonado
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    // Observar a seção de stats
    setTimeout(() => {
      const statsSection = document.querySelector('.about-stats-interactive');
      if (statsSection) {
        observer.observe(statsSection);
      }
    }, 100);
  }

  onTimelineHover(index: number): void {
    this.timeline[index].isHovered = true;
  }

  onTimelineLeave(index: number): void {
    this.timeline[index].isHovered = false;
  }
}

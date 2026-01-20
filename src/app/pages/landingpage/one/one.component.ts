import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-one',
  imports: [CommonModule, RouterModule],
  templateUrl: './one.component.html',
  styleUrl: './one.component.scss'
})
export class OneComponent implements OnInit, OnDestroy {
  currentClientIndex = 0;
  clientScrollInterval: any;

  clients = [
    { id: 1, image: 'assets/images/client_1.png', alt: 'Cliente 1' },
    { id: 2, image: 'assets/images/client_2.png', alt: 'Cliente 2' },
    { id: 3, image: 'assets/images/client_3.png', alt: 'Cliente 3' },
    { id: 4, image: 'assets/images/client_4.png', alt: 'Cliente 4' },
    { id: 5, image: 'assets/images/client_5.png', alt: 'Cliente 5' }
  ];

  services = [
    {
      title: 'Pavimentação',
      description: 'Soluções completas em asfalto, piso de concreto e paver com tecnologia de ponta e qualidade garantida.',
      items: ['Asfalto', 'Piso Concreto', 'Paver'],
      icon: '🛣️'
    },
    {
      title: 'Saneamento',
      description: 'Expertise em infraestrutura de saneamento, garantindo eficiência e sustentabilidade para seu projeto.',
      items: ['ETE', 'ETA', 'Estação Elevatória', 'Esgoto', 'Linha de Recalque', 'Tronco Coletor', 'Adutora', 'Linha de Água'],
      icon: '💧'
    }
  ];

  ngOnInit(): void {
    this.startClientCarousel();
  }

  ngOnDestroy(): void {
    if (this.clientScrollInterval) {
      clearInterval(this.clientScrollInterval);
    }
  }

  startClientCarousel(): void {
    this.clientScrollInterval = setInterval(() => {
      this.currentClientIndex = (this.currentClientIndex + 1) % this.clients.length;
    }, 3000);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToNextSection(): void {
    this.scrollToSection('sobre');
  }
}

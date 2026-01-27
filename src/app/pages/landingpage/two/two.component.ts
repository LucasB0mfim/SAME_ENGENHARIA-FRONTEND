import { Component, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-two',
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './two.component.html',
  styleUrl: './two.component.scss'
})
export class TwoComponent {
  leads = [
    { url: 'assets/logo/lead__aena.png', alt: 'Aena Aeroportos' },
    { url: 'assets/logo/lead__bimbo.png', alt: 'Bimbo' },
    { url: 'assets/logo/lead__coca.png', alt: 'Coca Coca Solar' },
    { url: 'assets/logo/lead__votorantim.png', alt: 'Votorantim' },
    { url: 'assets/logo/lead__heineken.png', alt: 'Heineken' },
    { url: 'assets/logo/lead__moura.png', alt: 'Baterias Moura' },
    { url: 'assets/logo/lead__guerdal.png', alt: 'Guerdal' },
  ]

  services = [
    { title: 'Pavimentação' },
    { title: 'Piso de concreto' },
    { title: 'Asfalto' },
    { title: 'ETE' },
    { title: 'ETA' },
    { title: 'Estação elevatória' },
    { title: 'Esgoto' },
    { title: 'Linha de água' },
  ]
}

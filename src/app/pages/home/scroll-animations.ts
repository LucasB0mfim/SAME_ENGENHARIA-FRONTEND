import { trigger, state, style, transition, animate, AnimationTriggerMetadata } from '@angular/animations';

/**
 * Animações de scroll para landing page
 * Valores reduzidos para evitar overflow horizontal em mobile
 */

export const fadeIn: AnimationTriggerMetadata = trigger('fadeIn', [
  state('hidden', style({
    opacity: 0
  })),
  state('visible', style({
    opacity: 1
  })),
  transition('hidden => visible', [
    animate('800ms ease-out')
  ]),
  transition('visible => hidden', [
    animate('600ms ease-in')
  ])
]);

export const slideFromLeft: AnimationTriggerMetadata = trigger('slideFromLeft', [
  state('hidden', style({
    opacity: 0,
    transform: 'translateX(-30px)' // Reduzido de -100px para -30px
  })),
  state('visible', style({
    opacity: 1,
    transform: 'translateX(0)'
  })),
  transition('hidden => visible', [
    animate('700ms ease-out')
  ]),
  transition('visible => hidden', [
    animate('500ms ease-in')
  ])
]);

export const slideFromRight: AnimationTriggerMetadata = trigger('slideFromRight', [
  state('hidden', style({
    opacity: 0,
    transform: 'translateX(30px)' // Reduzido de 100px para 30px
  })),
  state('visible', style({
    opacity: 1,
    transform: 'translateX(0)'
  })),
  transition('hidden => visible', [
    animate('700ms ease-out')
  ]),
  transition('visible => hidden', [
    animate('500ms ease-in')
  ])
]);

export const slideFromTop: AnimationTriggerMetadata = trigger('slideFromTop', [
  state('hidden', style({
    opacity: 0,
    transform: 'translateY(-40px)' // Reduzido de -80px para -40px
  })),
  state('visible', style({
    opacity: 1,
    transform: 'translateY(0)'
  })),
  transition('hidden => visible', [
    animate('800ms ease-out')
  ]),
  transition('visible => hidden', [
    animate('500ms ease-in')
  ])
]);

export const slideFromBottom: AnimationTriggerMetadata = trigger('slideFromBottom', [
  state('hidden', style({
    opacity: 0,
    transform: 'translateY(40px)' // Reduzido de 80px para 40px
  })),
  state('visible', style({
    opacity: 1,
    transform: 'translateY(0)'
  })),
  transition('hidden => visible', [
    animate('800ms ease-out')
  ]),
  transition('visible => hidden', [
    animate('500ms ease-in')
  ])
]);

export const scaleUp: AnimationTriggerMetadata = trigger('scaleUp', [
  state('hidden', style({
    opacity: 0,
    transform: 'scale(0.9)' // Reduzido de 0.85 para 0.9
  })),
  state('visible', style({
    opacity: 1,
    transform: 'scale(1)'
  })),
  transition('hidden => visible', [
    animate('700ms ease-out')
  ]),
  transition('visible => hidden', [
    animate('500ms ease-in')
  ])
]);

// Animação combinada: fade + slide
export const fadeSlideUp: AnimationTriggerMetadata = trigger('fadeSlideUp', [
  state('hidden', style({
    opacity: 0,
    transform: 'translateY(30px)' // Reduzido de 60px para 30px
  })),
  state('visible', style({
    opacity: 1,
    transform: 'translateY(0)'
  })),
  transition('hidden => visible', [
    animate('900ms cubic-bezier(0.35, 0, 0.25, 1)')
  ]),
  transition('visible => hidden', [
    animate('600ms ease-in')
  ])
]);

// Exportar todas as animações em um array para facilitar o import
export const scrollAnimations = [
  fadeIn,
  slideFromLeft,
  slideFromRight,
  slideFromTop,
  slideFromBottom,
  scaleUp,
  fadeSlideUp
];

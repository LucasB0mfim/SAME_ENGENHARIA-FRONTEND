import { trigger, state, style, transition, animate, AnimationTriggerMetadata } from '@angular/animations';

/**
 * Animações de scroll para landing page
 * Cada animação pode ser facilmente trocada modificando o parâmetro no HTML
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
    transform: 'translateX(-100px)'
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
    transform: 'translateX(100px)'
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
    transform: 'translateY(-80px)'
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
    transform: 'translateY(80px)'
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
    transform: 'scale(0.85)'
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
    transform: 'translateY(60px)'
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

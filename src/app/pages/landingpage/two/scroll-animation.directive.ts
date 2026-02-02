import { Directive, ElementRef, Output, EventEmitter, OnInit, OnDestroy, Input } from '@angular/core';

/**
 * Diretiva que detecta quando um elemento está visível no viewport
 * Usa Intersection Observer API para performance otimizada
 */
@Directive({
  selector: '[appScrollAnimation]',
  standalone: true
})
export class ScrollAnimationDirective implements OnInit, OnDestroy {
  @Output() visibilityChange = new EventEmitter<boolean>();

  /**
   * Threshold define quanto do elemento precisa estar visível
   * 0.5 = 50% do elemento precisa estar visível
   */
  @Input() threshold: number = 0.5;

  private observer?: IntersectionObserver;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver(): void {
    const options: IntersectionObserverInit = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: this.threshold
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Emite true quando visível, false quando não visível
        this.visibilityChange.emit(entry.isIntersecting);
      });
    }, options);

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

import { Directive, ElementRef, inject, Input, OnInit } from '@angular/core';

type ButtonSize = 'tiny' | 'small' | 'medium' | 'large';

/**
 * Danke btxtiger (https://github.com/btxtiger/mat-icon-button-sizes)
 */
@Directive({
  selector: 'button[matIconButtonSize]',
})
export class MatIconButtonSizeDirective implements OnInit {
  @Input() size: ButtonSize = 'large';
  #el = inject(ElementRef);

  ngOnInit(): void {
    this.#el.nativeElement.classList.add(`mat-${this.size}-icon-button`);
  }
}

/**
 * autofocus HTML не работает должным образом при динамических изменениях,
 * поэтому будем пользоваться этим
 */

import { Directive, AfterViewInit, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[autofocus]',
})
export class AutofocusDirective implements AfterViewInit {
  #el = inject(ElementRef);

  ngAfterViewInit() {
    this.#el.nativeElement.focus();
  }
}

import { Directive, ElementRef, inject, OnInit } from '@angular/core';

@Directive({
  selector: '[hoverShowTarget]',
  standalone: true,
})
export class HoverShowTargetDirective implements OnInit {
  #el = inject(ElementRef);

  ngOnInit(): void {
    this.#el.nativeElement.classList.add('hover-show-target');
  }

  setVisible(visible: boolean) {
    if (visible) {
      this.#el.nativeElement.classList.add('hover-show-target--visible');
    } else {
      this.#el.nativeElement.classList.remove('hover-show-target--visible');
    }
  }
}

import {
  Directive,
  ContentChildren,
  EventEmitter,
  HostListener,
  OnDestroy,
  QueryList,
  AfterContentInit,
  Output,
} from '@angular/core';
import { HoverShowTargetDirective } from './hover-show-target.directive';

@Directive({
  selector: '[hoverShowHost]',
  standalone: true,
})
export class HoverShowHostDirective implements AfterContentInit, OnDestroy {
  @ContentChildren(HoverShowTargetDirective, { descendants: true })
  targets!: QueryList<HoverShowTargetDirective>;

  @HostListener('mouseenter')
  onMouseEnter() {
    this.#setVisibility(true);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.#setVisibility(false);
  }

  #setVisibility(visible: boolean) {
    this.targets?.forEach((target) => {
      target.setVisible(visible);
    });
  }

  ngAfterContentInit(): void {
    if (this.targets.length === 0) {
      console.warn('[hoverShowHost] не имеет ни одного [hoverShowTarget]!');
    }
  }

  ngOnDestroy() {
    this.#setVisibility(false);
  }
}

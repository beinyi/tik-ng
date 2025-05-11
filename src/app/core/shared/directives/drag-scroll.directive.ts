import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[dragScroll]',
})
export class DragScrollDirective {
  private isPressed = false;
  private startX = 0;
  private startY = 0;
  private scrollLeft = 0;
  private scrollTop = 0;

  private el = inject(ElementRef);

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('[cdkDragHandle]')) return;

    this.isPressed = true;
    this.el.nativeElement.style.cursor = 'grabbing';
    this.startX = event.pageX - this.el.nativeElement.offsetLeft;
    this.startY = event.pageY - this.el.nativeElement.offsetTop;
    this.scrollLeft = this.el.nativeElement.scrollLeft;
    this.scrollTop = this.el.nativeElement.scrollTop;
  }

  @HostListener('mouseleave')
  @HostListener('mouseup')
  onMouseUp() {
    this.isPressed = false;
    this.el.nativeElement.style.cursor = 'default';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isPressed) return;

    event.preventDefault();
    const x = event.pageX - this.el.nativeElement.offsetLeft;
    const y = event.pageY - this.el.nativeElement.offsetTop;
    const walkX = x - this.startX;
    const walkY = y - this.startY;
    this.el.nativeElement.scrollLeft = this.scrollLeft - walkX;
    this.el.nativeElement.scrollTop = this.scrollTop - walkY;
  }
}

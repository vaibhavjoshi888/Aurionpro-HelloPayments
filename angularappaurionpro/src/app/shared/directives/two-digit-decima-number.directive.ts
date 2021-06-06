import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTwoDigitDecimaNumber]'
})
export class TwoDigitDecimaNumberDirective {
  // Allow decimal numbers and negative values
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'Delete', 'ArrowLeft'];

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);

    // condition to handle (only one . is allowed in amount field)
    if (current.indexOf('.') > -1 && event.key === '.') {
        event.preventDefault();
    }

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}

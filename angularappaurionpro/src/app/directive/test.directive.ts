import{Directive, ElementRef} from '@angular/core';

@Directive({
  selector:'[app-test]'
})
export class TestDirective{
  constructor(el: ElementRef) {
    var num = 12;
    var n = num.toFixed(2);
    debugger;;
   // el.nativeElement.style.backgroundColor = 'yellow';
    el['value']=12;

    el.nativeElement.value=n;
    var aa=el.nativeElement.value;

 }
}

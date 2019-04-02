import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[form-host]', 
})
export class FormDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
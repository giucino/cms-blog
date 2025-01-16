import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  selector: '[appMaxLength]',
  standalone: true
})
export class MaxLengthDirective {

  @Input('appMaxLength') maxLength!: number;
  
  constructor( private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const trimmed = input.value.slice(0, this.maxLength);
    input.value = trimmed;
    this.control.control?.setValue(trimmed, { emitEvent: false });
  }

}

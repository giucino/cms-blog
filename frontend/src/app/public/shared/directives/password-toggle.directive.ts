import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appPasswordToggle]',
  standalone: true,
})
export class PasswordToggleDirective implements OnInit {
  private showPassword = false;
  private button!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.setupPasswordToggle();
  }

  private setupPasswordToggle() {
    // Container erstellen
    const container = this.renderer.createElement('div');
    this.renderer.addClass(container, 'relative');

    // Button erstellen
    this.button = this.renderer.createElement('button');
    this.renderer.setAttribute(this.button, 'type', 'button');
    this.renderer.addClass(this.button, 'absolute');
    this.renderer.addClass(this.button, 'right-2');
    this.renderer.addClass(this.button, 'top-1/2');
    this.renderer.addClass(this.button, '-translate-y-1/2');
    this.renderer.addClass(this.button, 'p-2');

    // Icon erstellen
    const icon = this.renderer.createElement('i');
    this.renderer.addClass(icon, 'fas');
    this.renderer.addClass(icon, 'fa-eye');
    this.renderer.addClass(icon, 'text-gray-500');

    // DOM Struktur aufbauen
    this.renderer.appendChild(this.button, icon);

    // Input in Container wrappen
    const parent = this.el.nativeElement.parentNode;
    this.renderer.insertBefore(parent, container, this.el.nativeElement);
    this.renderer.appendChild(container, this.el.nativeElement);
    this.renderer.appendChild(container, this.button);

    // Click Handler
    this.renderer.listen(this.button, 'click', () => {
      this.showPassword = !this.showPassword;
      this.updatePasswordVisibility(icon);
    });
  }

  private updatePasswordVisibility(icon: HTMLElement) {
    if (this.showPassword) {
      this.renderer.setAttribute(this.el.nativeElement, 'type', 'text');
      this.renderer.removeClass(icon, 'fa-eye');
      this.renderer.addClass(icon, 'fa-eye-slash');
    } else {
      this.renderer.setAttribute(this.el.nativeElement, 'type', 'password');
      this.renderer.removeClass(icon, 'fa-eye-slash');
      this.renderer.addClass(icon, 'fa-eye');
    }
  }
}

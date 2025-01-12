import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  @Output() close = new EventEmitter<void>();
  isVisible: boolean = false;
  message: string = '';
  @ViewChild('closeButton') closeButton!: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isVisible) {
      if (event.key === 'Escape') {
        this.closeModal();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        this.closeButton.nativeElement.focus();
      }
    }
  }

  openModal() {
    this.isVisible = true;
    if (this.closeButton) {
      setTimeout(() => this.closeButton.nativeElement.focus(), 0);
    }
  }

  closeModal() {
    this.isVisible = false;
    this.close.emit();
  }

  ngAfterViewInit() {
    if (this.closeButton && this.isVisible) {
      this.closeButton.nativeElement.focus();
    }
  }
}

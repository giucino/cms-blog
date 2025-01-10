import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.scss'
})
export class SuccessModalComponent {
  isVisible = false;
  message = 'Erfolgreich aktualisiert';

  show(message?: string) {
    if (message) {
      this.message = message;
    }
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }

}

import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

// import { ModalConfig } from '../../services/modal.service';
import { ModalConfig } from '../../interfaces/models/types.model.interface';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.scss',
})
export class SuccessModalComponent {
  // @Input() config!: ModalConfig;
  config: ModalConfig | null = null;
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

  openModal(config: ModalConfig) {
    // this.message = message;
    this.config = config;
    this.isVisible = true;
    setTimeout(() => this.closeButton.nativeElement.focus(), 0);
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

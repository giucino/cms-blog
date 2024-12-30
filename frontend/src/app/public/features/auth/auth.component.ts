import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DarkModeService } from '../../../core/services/dark-mode.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  private darkModeService = inject(DarkModeService);
  isDarkMode$: Observable<boolean> = this.darkModeService.isDarkMode();

  /**
   * Toggle the dark mode. This will update the document body class and store the setting in local storage.
   */
  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { DarkModeService } from '../../../../core/services/dark-mode.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  authService = inject(AuthService);
  isMenuOpen = false;
  private darkModeService = inject(DarkModeService);
  isDarkMode$: Observable<boolean> = this.darkModeService.isDarkMode();

  menuItems = [
    { path: '/', label: 'Home' },
    { path: '/post/re', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Toggle the dark mode. This will update the document body class and store the setting in local storage.
   */
  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }

  isActive(path: string): boolean {
    return this.router.isActive(path, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}

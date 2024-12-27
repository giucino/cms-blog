import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

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
  // menuItems = [
  //   { path: '/', label: 'Home' },
  //   { path: '/about', label: 'About Us' },
  //   { path: '/contact', label: 'Contact' }
  // ];

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // const toggleOpen = document.getElementById('toggleOpen');
  // const toggleClose = document.getElementById('toggleClose');
  // const collapseMenu = document.getElementById('collapseMenu');

  // handleClick() {
  //   if (collapseMenu.style.display === 'block') {
  //     collapseMenu.style.display = 'none';
  //   } else {
  //     collapseMenu.style.display = 'block';
  //   }
  // }

  // toggleOpen.addEventListener('click', handleClick);
  // toggleClose.addEventListener('click', handleClick);
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
// import { DarkModeService } from '../../../../core/services/dark-mode.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  isMenuOpen = false;
  // private darkModeService = inject(DarkModeService);
  // isDarkMode$: Observable<boolean> = this.darkModeService.isDarkMode();
  isDarkMode: boolean = false;

  menuItems = [
    { path: '/', label: 'Home' },
    { path: '/post/re', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('color-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.isDarkMode = true;
      this.renderer.addClass(document.documentElement, 'dark');
    } else {
      this.isDarkMode = false;
      this.renderer.removeClass(document.documentElement, 'dark');
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.renderer.addClass(document.documentElement, 'dark');
      localStorage.setItem('color-theme', 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
      localStorage.setItem('color-theme', 'light');
    }
  }

  // ngOnInit(): void {

  //   if (
  //     localStorage.getItem('color-theme') === 'dark' ||
  //     (!('color-theme' in localStorage) &&
  //       window.matchMedia('(prefers-color-scheme: dark)').matches)
  //   ) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  //   const themeToggleDarkIcon = document.getElementById(
  //     'theme-toggle-dark-icon'
  //   );
  //   const themeToggleLightIcon = document.getElementById(
  //     'theme-toggle-light-icon'
  //   );

  //   if (
  //     localStorage.getItem('color-theme') === 'dark' ||
  //     (!('color-theme' in localStorage) &&
  //       window.matchMedia('(prefers-color-scheme: dark)').matches)
  //   ) {
  //     themeToggleLightIcon!.classList.remove('hidden');
  //   } else {
  //     themeToggleDarkIcon!.classList.remove('hidden');
  //   }

  //   const themeToggleBtn = document.getElementById('theme-toggle');

  //   themeToggleBtn!.addEventListener('click', () => {
  //     themeToggleDarkIcon!.classList.toggle('hidden');
  //     themeToggleLightIcon!.classList.toggle('hidden');

  //     if (localStorage.getItem('color-theme')) {
  //       if (localStorage.getItem('color-theme') === 'light') {
  //         document.documentElement.classList.add('dark');
  //         localStorage.setItem('color-theme', 'dark');
  //       } else {
  //         document.documentElement.classList.remove('dark');
  //         localStorage.setItem('color-theme', 'light');
  //       }

  //     } else {
  //       if (document.documentElement.classList.contains('dark')) {
  //         document.documentElement.classList.remove('dark');
  //         localStorage.setItem('color-theme', 'light');
  //       } else {
  //         document.documentElement.classList.add('dark');
  //         localStorage.setItem('color-theme', 'dark');
  //       }
  //     }
  //   });
  // }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  // toggleDarkMode() {
  //   this.darkModeService.toggleDarkMode();
  // }

  isActive(path: string): boolean {
    return this.router.isActive(path, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}

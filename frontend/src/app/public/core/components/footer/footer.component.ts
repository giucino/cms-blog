import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  menuItems = [
    { path: '/', label: 'Home' },
    { path: '/post/re', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  constructor() {}
}

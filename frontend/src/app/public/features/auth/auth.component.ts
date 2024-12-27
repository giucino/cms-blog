import { Component } from '@angular/core';
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
  isDarkMode$: Observable<boolean>;  

  constructor(private darkModeService: DarkModeService) {
    this.isDarkMode$ = this.darkModeService.isDarkMode();
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }
}

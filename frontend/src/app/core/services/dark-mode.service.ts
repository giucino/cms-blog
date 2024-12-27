// dark-mode.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkMode = new BehaviorSubject<boolean>(false);

  constructor() {
    this.loadSavedMode();
  }

  toggleDarkMode(): void {
    this.darkMode.next(!this.darkMode.value);
    this.saveMode();
    this.updateBodyClass();
  }

  isDarkMode() {
    return this.darkMode.asObservable();
  }

  private loadSavedMode(): void {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      this.darkMode.next(JSON.parse(savedMode));
      this.updateBodyClass();
    }
  }

  private saveMode(): void {
    localStorage.setItem('darkMode', JSON.stringify(this.darkMode.value));
  }

  private updateBodyClass(): void {
    if (this.darkMode.value) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
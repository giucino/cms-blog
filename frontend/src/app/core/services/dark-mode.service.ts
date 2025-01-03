import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
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

// // Normales Subject
// const subject = new Subject<boolean>();
// subject.subscribe(val => console.log('A:', val)); // Wartet auf neue Werte
// subject.next(true); // A: true
// subject.subscribe(val => console.log('B:', val)); // B bekommt nichts vom vorherigen true

// // BehaviorSubject
// const behaviorSubject = new BehaviorSubject<boolean>(false);
// behaviorSubject.subscribe(val => console.log('A:', val)); // A: false (sofort!)
// behaviorSubject.next(true); // A: true
// behaviorSubject.subscribe(val => console.log('B:', val)); // B: true (bekommt letzten Wert sofort)

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private darkMode = new BehaviorSubject<boolean>(false);

  /**
   * Loads the saved dark mode from local storage when the service is initialized.
   */
  constructor() {
    this.loadSavedMode();
  }

  /**
   * Toggles the dark mode and saves the mode to local storage.
   * Also updates the document body class with the current mode.
   */
  toggleDarkMode(): void {
    this.darkMode.next(!this.darkMode.value);
    this.saveMode();
    this.updateBodyClass();
  }

  /**
   * Returns an observable of the current dark mode state.
   * @returns An observable of a boolean value, true if dark mode is enabled, false otherwise.
   */
  isDarkMode() {
    return this.darkMode.asObservable();
  }

  /**
   * Loads the saved dark mode from local storage and sets the initial dark mode state.
   * If no saved mode is found, the dark mode is set to false.
   * The document body class is updated to reflect the loaded mode.
   */
  private loadSavedMode(): void {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      this.darkMode.next(JSON.parse(savedMode));
      this.updateBodyClass();
    }
  }

  /**
   * Saves the current dark mode state to local storage.
   * The state is stored as a JSON string with the key 'darkMode'.
   */
  private saveMode(): void {
    localStorage.setItem('darkMode', JSON.stringify(this.darkMode.value));
  }

  /**
   * Updates the document body class based on the current dark mode state.
   * Adds the 'dark' class if dark mode is enabled, otherwise removes it.
   */
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

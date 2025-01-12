// import {
//   Injectable,
//   ApplicationRef,
//   Injector,
//   ComponentRef,
//   createComponent,
//   EmbeddedViewRef,
// } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { SuccessModalComponent } from '../components/success-modal/success-modal.component';

// export interface ModalConfig {
//   title: string;
//   message: string;
//   iconPath: string;
//   iconClass?: string;
//   iconBackgroundClass?: string;
//   textClass?: string;
//   buttonClass?: string;
//   confirmButtonText?: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class ModalService {
//   private modalConfigSubject = new BehaviorSubject<ModalConfig | null>(null);
//   modalConfig$ = this.modalConfigSubject.asObservable();

//   private isOpenSubject = new BehaviorSubject<boolean>(false);
//   isOpen$ = this.isOpenSubject.asObservable();

//   private modalComponentRef: ComponentRef<SuccessModalComponent> | null = null;

//   constructor(private appRef: ApplicationRef, private injector: Injector) {}

//   openModal(config: ModalConfig) {
//     this.modalConfigSubject.next(config);
//     this.isOpenSubject.next(true);
//   }

//   closeModal() {
//     this.isOpenSubject.next(false);
//   }

//   removeExistingModal() {
//     if (this.modalComponentRef) {
//       this.appRef.detachView(this.modalComponentRef.hostView);
//       this.modalComponentRef.destroy();
//       this.modalComponentRef = null;
//     }
//   }

//   show(message?: string) {
//     this.removeExistingModal();

//     this.modalComponentRef = createComponent(SuccessModalComponent, {
//       environmentInjector: this.appRef.injector,
//       elementInjector: this.injector,
//     });

//     this.appRef.attachView(this.modalComponentRef.hostView);
//     const domElem = (this.modalComponentRef.hostView as EmbeddedViewRef<any>)
//       .rootNodes[0];
//     document.body.appendChild(domElem);

//     const modalInstance = this.modalComponentRef.instance;
//     modalInstance.openModal(message || 'Aktion erfolgreich');

//     modalInstance.close.subscribe(() => {
//       this.removeExistingModal();
//     });
//   }
// }

import {
  Injectable,
  ApplicationRef,
  Injector,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SuccessModalComponent } from '../components/success-modal/success-modal.component';
import { ModalConfig } from '../interfaces/models/types.model.interface';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalConfigSubject = new BehaviorSubject<ModalConfig | null>(null);
  modalConfig$ = this.modalConfigSubject.asObservable();

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  private modalComponentRef: ComponentRef<SuccessModalComponent> | null = null;

  constructor(private appRef: ApplicationRef, private injector: Injector, private sanitizer: DomSanitizer) {}

  openModal(config: ModalConfig) {
    this.modalConfigSubject.next(config);
    this.isOpenSubject.next(true);
  }

  closeModal() {
    this.isOpenSubject.next(false);
  }

  private removeExistingModal() {
    if (this.modalComponentRef) {
      this.appRef.detachView(this.modalComponentRef.hostView);
      this.modalComponentRef.destroy();
      this.modalComponentRef = null;
    }
  }

  showCreated(message: string) {
    this.show(message, 'created');
  }

  showUpdated(message: string) {
    this.show(message, 'updated');
  }

  showDeleted(message: string) {
    this.show(message, 'deleted');
  }

  showError(message: string) {
    this.show(message, 'error');
  }

  show(message: string, state: 'created' | 'updated' | 'deleted' | 'error') {
    this.removeExistingModal();

    this.modalComponentRef = createComponent(SuccessModalComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector
    });

    this.appRef.attachView(this.modalComponentRef.hostView);
    const domElem = (this.modalComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];
    document.body.appendChild(domElem);

    const modalInstance = this.modalComponentRef.instance;
    const config: ModalConfig = {
      message: message,
      iconConfig: {
        path: this.getSafeIconPathForState(state),
        class: this.getIconClassForState(state),
        backgroundClass: this.getIconBackgroundClassForState(state),
        ariaHidden: 'true',
        fill: 'currentColor',
        viewBox: '0 0 20 20',
        xmlns: 'http://www.w3.org/2000/svg'
      },
      textClass: 'mb-4 text-lg font-semibold text-gray-900 dark:text-white',
      buttonClass: this.getButtonClassForState(state),
      confirmButtonText: 'Weiter',
      state: state,
      srOnlyText: this.getSrOnlyTextForState(state)
    };

    modalInstance.openModal(config);

    modalInstance.close.subscribe(() => {
      this.removeExistingModal();
    });
  }

    private getSafeIconPathForState(state: 'created' | 'updated' | 'deleted' | 'error'): SafeHtml {
    const rawPath = this.getIconPathForState(state);
    return this.sanitizer.bypassSecurityTrustHtml(rawPath);
  }

  private getIconPathForState(state: 'created' | 'updated' | 'deleted' | 'error'): string {
    switch (state) {
      case 'created':
      case 'updated':
        return `<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>`;
      case 'deleted':
        return `<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>`;
      case 'error':
        return `<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>`;
    }
  }

  private getSrOnlyTextForState(state: 'created' | 'updated' | 'deleted' | 'error'): string {
    switch (state) {
      case 'created':
        return 'Erfolg';
      case 'updated':
        return 'Erfolg';
      case 'deleted':
        return 'Löschen';
      case 'error':
        return 'Fehler';
    }
  }

  private getIconClassForState(state: 'created' | 'updated' | 'deleted' | 'error'): string {
    switch (state) {
      case 'created':
      case 'updated':
        return 'w-8 h-8 text-green-500 dark:text-green-400';
      case 'deleted':
        return 'w-8 h-8 text-red-500 dark:text-red-400';
      case 'error':
        return 'w-8 h-8 text-yellow-500 dark:text-yellow-400';
    }
  }

  private getIconBackgroundClassForState(state: 'created' | 'updated' | 'deleted' | 'error'): string {
    switch (state) {
      case 'created':
      case 'updated':
        return 'w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5';
      case 'deleted':
        return 'w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 p-2 flex items-center justify-center mx-auto mb-3.5';
      case 'error':
        return 'w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 p-2 flex items-center justify-center mx-auto mb-3.5';
    }
  }

  private getButtonClassForState(state: 'created' | 'updated' | 'deleted' | 'error'): string {
    switch (state) {
      case 'created':
      case 'updated':
        return 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:focus:ring-primary-900';
      case 'deleted':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800';
      case 'error':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-300 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-yellow-800';
    }
  }
}

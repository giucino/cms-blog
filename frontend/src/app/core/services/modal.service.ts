import { ApplicationRef, ComponentRef, createComponent, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import { SuccessModalComponent } from '../components/success-modal/success-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalComponentRef: ComponentRef<SuccessModalComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  show(message?: string) {
    // Falls bereits ein Modal existiert, dieses zuerst entfernen
    this.removeExistingModal();

    // Neue Modal-Komponente erstellen
    this.modalComponentRef = createComponent(SuccessModalComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector
    });

    // Komponente an DOM anhängen
    this.appRef.attachView(this.modalComponentRef.hostView);
    const domElem = (this.modalComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];
    document.body.appendChild(domElem);

    // Modal anzeigen
    this.modalComponentRef.instance.show(message);

    // Event Listener für das Schließen
    this.modalComponentRef.instance.close = () => {
      this.removeExistingModal();
    };
  }

  private removeExistingModal() {
    if (this.modalComponentRef) {
      this.appRef.detachView(this.modalComponentRef.hostView);
      this.modalComponentRef.destroy();
      this.modalComponentRef = null;
    }
  }
}

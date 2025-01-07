import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private toggleSource = new Subject<void>();
  toggle$ = this.toggleSource.asObservable();

  toggle() {
    this.toggleSource.next();
  }
}

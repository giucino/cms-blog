import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatDividerModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  @Output() closeBtnClicked = new EventEmitter<void>();
  sidebarService = inject(SidebarService);

  closeDrawer() {
    this.sidebarService.toggle();
  }

  navigateAndClose() {
      setTimeout(() => {
        this.sidebarService.toggle();
      }, 500);
    }
}

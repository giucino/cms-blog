import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { SidebarService } from '../core/services/sidebar.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    FooterComponent,
    MatSidenavModule,
    SidebarComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  sidebarService = inject(SidebarService);

  ngOnInit() {
    this.sidebarService.toggle$.subscribe(() => {
      if (this.drawer) {
        this.drawer.toggle();
      }
    });
  }
}

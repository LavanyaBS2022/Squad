import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutingModule } from '../../app-routing.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppRoutingModule,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  currentRoute = ''; 
  menus = [
    { label: 'Dashboard', route: '/dashboard', icon: 'fas fa-tachometer-alt' },
    { label: 'Create Visit', route: '/create-visit', icon: 'fas fa-plus-circle' },
    { label: 'Visit List', route: '/visit-list', icon: 'fas fa-list-alt' },
    { label: 'Reports', route: '/reports', icon: 'fas fa-list-alt' },
  ];

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}

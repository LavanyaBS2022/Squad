import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  showProfileMenu = false;
  userName = '';
  userId = '';
  companyName = '';
  
  @ViewChild('profileContainer') profileContainer!: ElementRef;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.profileContainer && !this.profileContainer.nativeElement.contains(event.target)) {
      this.showProfileMenu = false;
    }
  }

  getUserInitial(): string {
    return this.userName ? this.userName.charAt(0) : 'U';
  }

  viewProfile() {
    this.router.navigate(['/profile']);
    this.showProfileMenu = false;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    
    this.router.navigate(['/login']);
    this.showProfileMenu = false;
  }

  loadUserInfo() {
    this.userName = localStorage.getItem('userName') || 'User';
    this.userId = localStorage.getItem('userId') || '';
    console.log('User loaded in header:', this.userName);
  }
}
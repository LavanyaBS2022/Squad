import { Component } from '@angular/core';
import { CreateVisitComponent } from '../../features/visits/create-visit/create-visit.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CreateVisitComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private router: Router) {}


  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}

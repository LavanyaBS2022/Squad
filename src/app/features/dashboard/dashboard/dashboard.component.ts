import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
interface Visit {
  date: string;
  route: string;
  type: string;
  inspector: string;
  remarks: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit{
  totalVisits: number = 150;
  customerComplaints: number = 25;
  marketingComplaints: number = 10;
  recentVisits: Visit[] = [];

  constructor() {}

  ngOnInit() {
    this.recentVisits = [
      {
        date: '2024-10-01',
        route: 'Route A',
        type: 'Regular Visit',
        inspector: 'John Doe',
        remarks: 'Routine check completed'
      },
      {
        date: '2024-10-02',
        route: 'Route B',
        type: 'Customer Complaint',
        inspector: 'Jane Smith',
        remarks: 'Complaint resolved'
      },
      {
        date: '2024-10-03',
        route: 'Route C',
        type: 'Marketing Department Complaint',
        inspector: 'John Doe',
        remarks: 'Marketing issue addressed'
      },
    ];
  }
}

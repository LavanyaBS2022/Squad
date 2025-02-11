import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/Materials/material.module';
interface Visit {
  date: string;
  type: string;
  inspector: string;
  remarks: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit{
  totalVisits: number = 150;
  customerComplaints: number = 25;
  marketingComplaints: number = 10;
  recentVisits: Visit[] = [];
  displayedColumns: string[] = ['date', 'type', 'inspector', 'remarks'];

  constructor() {}

  ngOnInit() {
    this.recentVisits = [
      {
        date: '2024-10-01',
        type: 'Regular Visit',
        inspector: 'John Doe',
        remarks: 'Routine check completed'
      },
      {
        date: '2024-10-02',
        type: 'Customer Complaint',
        inspector: 'Jane Smith',
        remarks: 'Complaint resolved'
      },
      {
        date: '2024-10-03',
        type: 'Marketing Department Complaint',
        inspector: 'John Doe',
        remarks: 'Marketing issue addressed'
      },
    ];
  }
}

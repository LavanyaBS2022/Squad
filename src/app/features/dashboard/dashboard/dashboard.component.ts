import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/Materials/material.module';
import { ApiService } from '../../../core/services/api.service';

interface Visit {
  date: string;
  type: string;
  inspector: string;
  remarks: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  totalVisits: number = 0;
  customerComplaints: number = 0;
  marketingComplaints: number = 0;
  recentVisits: Visit[] = [];
  displayedColumns: string[] = ['date', 'type', 'inspector', 'remarks'];

  visitTypesMap: { [key: number]: string } = {}; 
  inspectorsMap: { [key: number]: string } = {}; 

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getVisitTypes();
    this.getInspectors();
  }

  getVisitTypes() {
    this.apiService.getRequest('visits/visitType').subscribe(
      (response: any) => {
        if (response.status && response.data) {  
          response.data.forEach((type: any) => {
            this.visitTypesMap[type.sl_no] = type.description;
          });
          this.getVisits();
        }
      },
      (error) => {
        console.error('Error fetching visit types:', error);
      });
  }

  getInspectors() {
    this.apiService.getRequest('visits/getInspectorList').subscribe(
      (response: any) => {
        if (response.status && response.data) {
          response.data.forEach((inspector: any) => {
            this.inspectorsMap[inspector.employee_id] = inspector.employee_first_name.trim();
          });
        }
      },
      (error) => {
        console.error('Error fetching inspectors:', error);
      }
    );
  }

  getVisits() {
    this.apiService.getRequest('visits/sheduleVisit').subscribe(
      (response: any) => {
        if (response.status && response.data) {
          this.totalVisits = response.data.length;

          let sortedVisits = response.data.sort((a: any, b: any) => 
            new Date(b.schedule_date).getTime() - new Date(a.schedule_date).getTime()
          );

          this.customerComplaints = response.data.filter((visit: any) =>
            this.visitTypesMap[visit.visit_type] === "Customer complaint"
          ).length;

          this.marketingComplaints = response.data.filter((visit: any) =>
            this.visitTypesMap[visit.visit_type] === "Marketing department complaint"
          ).length;

          this.recentVisits = sortedVisits.slice(0, 3).map((visit: any) => ({
            date: new Date(visit.schedule_date).toLocaleDateString(),
            type: this.visitTypesMap[visit.visit_type] || 'Unknown Type', 
            inspector: this.inspectorsMap[visit.assigned_for] || 'Unknown',
            remarks: visit.nar.trim(),
          }));
        }
      },
      (error) => {
        console.error('Error fetching visits:', error);
      }
    );
  }
}

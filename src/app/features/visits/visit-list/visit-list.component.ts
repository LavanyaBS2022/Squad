import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/Materials/material.module';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { VisitDetailsComponent } from '../visit-details/visit-details.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-visit-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, HttpClientModule],
  templateUrl: './visit-list.component.html',
  styleUrl: './visit-list.component.scss'
})
export class VisitListComponent implements OnInit, AfterViewInit {
  visits: any[] = [];
  visitTypes: any[] = [];
  inspectors: any[] = [];
  visitTypeMap: Map<number, string> = new Map();
  inspectorMap: Map<number, string> = new Map();

  visitForm!: FormGroup;
  isLoading: boolean = true;  
  dataSource = new MatTableDataSource<any>([]);

  displayedColumns: string[] = ['Sl No','visitDate', 'visitType', 'inspector', 'remarks', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder, private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    this.visitForm = this.fb.group({
      visitDate: new FormControl(''),
      visitType: new FormControl(''),
      inspector: new FormControl(''),
      remarks: new FormControl(''),
    });

    this.fetchVisitTypes();
    this.fetchInspectors();
    this.getVisits();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'visitDate') {
        return item.visitDate ? new Date(item.visitDate).getTime() : 0;
      }
      return item[property];
    };
  }
  

  getVisits() {
    this.apiService.getRequest('visits/sheduleVisit').subscribe(
      (response: any) => {
        if (response.status && response.data) {

          this.visits = response.data.map((visit: any) => ({
            sl_no: visit.sl_no,
            party_sl: visit.party_sl,
            route: visit.party_sl,
            visitDate: new Date(visit.schedule_date),
            actualVisitDate: visit.actual_visited_date ? new Date(visit.actual_visited_date) : null,
            visitType: this.visitTypeMap.get(visit.visit_type) || 'Unknown', 
            inspector: this.inspectorMap.get(visit.assigned_for) || 'Unknown',
            remarks: visit.nar,
          }));

          this.dataSource.data = this.visits;
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching visits:', error);
        this.isLoading = false;
      }
    );
  }

  fetchVisitTypes(): void {
    this.apiService.getRequest<{ status: boolean, data: { sl_no: number, description: string }[] }>(
      'visits/visitType'
    ).subscribe(response => {
      if (response.status && response.data) {
        this.visitTypes = response.data;
        this.visitTypeMap = new Map(response.data.map(item => [item.sl_no, item.description]));
        this.getVisits();  
      }
    }, error => {
      console.error('Error fetching visit types:', error);
    });
  }

  fetchInspectors(): void {
    this.apiService.getRequest<{ status: boolean, data: { employee_id: number, employee_first_name: string }[] }>(
      'visits/getInspectorList'
    ).subscribe(response => {
      if (response.status && response.data) {
        this.inspectors = response.data;
        this.inspectorMap = new Map(response.data.map(item => [item.employee_id, item.employee_first_name]));
        this.getVisits(); 
      }
    }, error => {
      console.error('Error fetching inspectors:', error);
    });
  }

  openVisitDetails(visit: any) {
    const dialogRef = this.dialog.open(VisitDetailsComponent, {
      width: '500px',
      data: visit
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getVisits(); 
      }
    });
  }
}

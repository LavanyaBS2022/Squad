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

@Component({
  selector: 'app-visit-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, HttpClientModule],
  templateUrl: './visit-list.component.html',
  styleUrl: './visit-list.component.scss'
})
export class VisitListComponent implements OnInit, AfterViewInit {
    visits: any[] = [];
    visitForm!: FormGroup;
    isLoading: boolean = true;
    dataSource = new MatTableDataSource<any>([]);

    displayedColumns: string[] = ['Sl No', 'visitDate', 'visitType', 'inspector', 'remarks', 'actions'];
    @ViewChild(MatPaginator) paginator!: MatPaginator; 

    constructor(private fb: FormBuilder, private apiService: ApiService, private dialog: MatDialog) {}

    ngOnInit() {
      this.visitForm = this.fb.group({
        visitDate: new FormControl(''),
        visitType: new FormControl(''),
        inspector: new FormControl(''),
        remarks: new FormControl(''),
      });

      this.getVisits();
    }

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }

    getVisits() {
      this.apiService.getRequest('visits/sheduleVisit').subscribe(
        (response: any) => {
          if (response.status && response.data) {
            console.log('Fetched Data:', response.data);

            this.visits = response.data.map((visit: any) => ({
              sl_no: visit.sl_no,
              party_sl: visit.party_sl,
              route: visit.party_sl,
              visitDate: visit.schedule_date,
              actualVisitDate: visit.actual_visited_date,
              visitType: visit.visit_type,
              inspector: visit.assigned_for,
              assigned_for: visit.assigned_for,
              remarks: visit.nar,
            }));

            this.dataSource.data = this.visits;

            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }

            console.log("Processed Visits:", this.visits);
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching visits:', error);
          this.isLoading = false;
        }
      );
    }

    confirmDelete(visits:any){
console.log('data',visits)
    }

    
    openVisitDetails(visit: any) {
      const dialogRef = this.dialog.open(VisitDetailsComponent, {
        width: '500px',
        data: visit
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getVisits(); 
        }
      });
    }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/Materials/material.module';

@Component({
  selector: 'app-visit-list',
  standalone: true,
  imports: [CommonModule,MaterialModule,FormsModule],
  templateUrl: './visit-list.component.html',
  styleUrl: './visit-list.component.scss'
})

export class VisitListComponent implements OnInit {
  visits = [
    { route: 'Route 1', visitDate: new Date(), visitType: 'Type 1', inspector: 'Inspector 1', remarks: 'Remarks 1' },
    { route: 'Route 2', visitDate: new Date(), visitType: 'Type 2', inspector: 'Inspector 2', remarks: 'Remarks 2' },
  ];

  selectedVisit: any = null;
  visitForm!: FormGroup; 
  isEditing: boolean = false; 

  displayedColumns: string[] = ['#', 'route', 'visitDate', 'visitType', 'inspector', 'remarks', 'actions'];

  visitTypes = ['Type 1', 'Type 2', 'Type 3'];
  inspectors = ['Inspector 1', 'Inspector 2', 'Inspector 3'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.visitForm = this.fb.group({
      visitDate: new FormControl(''), 
      route: new FormControl(''),
      visitType: new FormControl(''),
      inspector: new FormControl(''),
      remarks: new FormControl(''),
    });
  }

  editVisit(visit: any) {
    debugger
    this.selectedVisit = { ...visit };
    this.isEditing = true; 

    this.visitForm.patchValue({
      route: visit.route,
      visitDate: this.formatDate(visit.visitDate), 
      visitType: visit.visitType,
      inspector: visit.inspector,
      remarks: visit.remarks,
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0]; 
  }

  submitVisit() {
    const visitData = this.visitForm.value;
  
    const index = this.visits.findIndex(v => v.route === this.selectedVisit.route);
  
    if (index !== -1) {
      this.visits[index] = {
        ...visitData, 
        visitDate: new Date(visitData.visitDate)  
      };
  
      this.visits = [...this.visits]; 
    }
  
    this.selectedVisit = null;
    this.visitForm.reset();
    this.isEditing = false;
  }
  

  cancelEdit() {
    this.selectedVisit = null; 
    this.visitForm.reset(); 
    this.isEditing = false; 
  }
}
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/Materials/material.module';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-visit-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './visit-details.component.html',
  styleUrl: './visit-details.component.scss'
})
export class VisitDetailsComponent {
  visitForm: FormGroup;
  inspectors: any[] = [];
  visitTypes: any[] = [];
  @Output() visitUpdated = new EventEmitter<void>(); 

  constructor(
    public dialogRef: MatDialogRef<VisitDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public visit: any,
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.visitForm = this.fb.group({
      visitDate: new FormControl({ value: this.formatDate(visit.visitDate), disabled: true }),
      actualVisitDate: new FormControl({ value: this.formatDate(visit.actualVisitDate), disabled: true }),
      visitType: new FormControl(null),
      inspector: new FormControl(null),
      remarks: new FormControl(visit.remarks)
    });

    this.fetchInspectors();
    this.fetchVisitTypes();
  }

  formatDate(date: string): string {
    if (!date) return ''; 
    const d = new Date(date);
    return d.toISOString().split('T')[0]; 
  }

  fetchInspectors(): void {
    this.apiService.getRequest<{ code: number; message: string; data: { employee_id: number; employee_first_name: string; employee_last_name: string | null }[] }>(
      'visits/getInspectorList'
    ).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.inspectors = response.data;
          const selectedInspector = this.inspectors.find(i => i.employee_id === this.visit.inspector);
          if (selectedInspector) {
            this.visitForm.patchValue({ inspector: selectedInspector.employee_id });
          }
        }
      },
      error: (err) => console.error('Error fetching inspectors:', err)
    });
  }

  fetchVisitTypes(): void {
    this.apiService.getRequest<{ code: number; message: string; data: { sl_no: number; name: string; description: string }[]; status: boolean }>(
      'visits/visitType'
    ).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.visitTypes = response.data;
          const selectedType = this.visitTypes.find(t => t.sl_no === this.visit.visitType);
          if (selectedType) {
            this.visitForm.patchValue({ visitType: selectedType.sl_no });
          }
        }
      },
      error: (err) => console.error('Error fetching visit types:', err)
    });
  }

  saveVisitDetails() {
    if (this.visitForm.valid) {
      const formValues = this.visitForm.getRawValue();

      const payload = {
        party_sl: this.visit.party_sl || 4321, 
        shedule_date: formValues.visitDate || '2024-12-20',
        actual_visit_date: formValues.actualVisitDate || '2024-12-25',
        visit_type: formValues.visitType || 58775, 
        shedule_type: 1, 
        assigned_for: formValues.inspector || 1, 
        status: 1,
        nar: formValues.remarks || 'Test 2', 
        sl_no: this.visit.sl_no || 58780 
      };

      this.apiService.putRequest('visits/sheduleVisit', payload).subscribe({
        next: (response) => {
          this.snackBar.open('Visit details saved successfully!', 'Close', { duration: 3000 });
          this.visitUpdated.emit(); 
          this.dialogRef.close(true); 
        },
        error: (error) => {
          console.error('Error saving visit details:', error);
          this.snackBar.open('Failed to save visit details', 'Close', { duration: 3000 });
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
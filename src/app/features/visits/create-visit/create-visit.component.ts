import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/Materials/material.module';
import { ApiService } from '../../../core/services/api.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
interface ApiResponse {
  code: number;
  message: string;
  data: boolean;
  status: boolean;
}

@Component({
  selector: 'app-create-visit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, NgxMatSelectSearchModule],
  templateUrl: './create-visit.component.html',
  styleUrls: ['./create-visit.component.scss'],
})
export class CreateVisitComponent implements OnInit {
  visitForm!: FormGroup;
  submitted = false;
  visitTypes: { sl_no: number; description: string }[] = []; 
  inspectors: { employee_id: number; employee_first_name: string; employee_last_name: string | null }[] = [];
  partyList: { sl_no: number; code: string; name2: string }[] = []; 
  today = new Date();

  filteredInspectors: any[] = [];
  filteredPartyList: any[] = [];

  inspectorFilterCtrl = new FormControl();
  partyFilterCtrl = new FormControl();

  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private apiService: ApiService 
  ) {}

  ngOnInit(): void {
    this.visitForm = this.fb.group({
      visitDate: [this.today, Validators.required],
      visitType: ['', Validators.required], 
      inspector: ['', Validators.required],
      party_sl: ['', Validators.required], 
      remarks: [''],
    });

    this.fetchVisitTypes(); 
    this.fetchInspectors();
    this.fetchPartyList();
    this.inspectorFilterCtrl.valueChanges
    .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((value) => {
      this.filterInspectors(value);
    });

  this.partyFilterCtrl.valueChanges
    .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((value) => {
      this.filterParties(value);
    });
  }

  fetchPartyList(): void {
    this.apiService
      .getRequest<{ code: number; message: string; data: { sl_no: number; code: string; name2: string }[]; status: boolean }>(
        'visits/getPartyList'
      )
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.partyList = response.data;
            this.filteredPartyList = [...this.partyList];

          } else {
            this.openSnackBar('Failed to load parties', 'error');
          }
        },
        error: (err) => {
          console.error('Error fetching parties:', err);
          this.openSnackBar('Error fetching parties', 'error');
        },
      });
  }

  fetchInspectors(): void {
    this.apiService
      .getRequest<{ code: number; message: string; data: { employee_id: number; employee_first_name: string; employee_last_name: string | null }[] }>(
        'visits/getInspectorList'
      )
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.inspectors = response.data;
            this.filteredInspectors = [...this.inspectors]; 

          } else {
            this.openSnackBar('Failed to load inspectors', 'error');
          }
        },
        error: (err) => {
          console.error('Error fetching inspectors:', err);
          this.openSnackBar('Error fetching inspectors', 'error');
        },
      });
  }


  filterInspectors(searchValue: string) {
    if (!searchValue) {
      this.filteredInspectors = [...this.inspectors];
      return;
    }
    const lowerCaseValue = searchValue.toLowerCase();
    this.filteredInspectors = this.inspectors.filter(
      (inspector) =>
        inspector.employee_first_name.toLowerCase().includes(lowerCaseValue) ||
        (inspector.employee_last_name && inspector.employee_last_name.toLowerCase().includes(lowerCaseValue))
    );
  }


  filterParties(searchValue: string) {
    if (!searchValue) {
      this.filteredPartyList = [...this.partyList];
      return;
    }
    const lowerCaseValue = searchValue.toLowerCase();
    this.filteredPartyList = this.partyList.filter((party) =>
      party.name2.toLowerCase().includes(lowerCaseValue)
    );
  }
  
  dateFilter = (date: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date ? date >= today : false;
  };

  fetchVisitTypes(): void {
    this.apiService
      .getRequest<{ code: number; message: string; data: { sl_no: number; name: string; description: string }[]; status: boolean }>(
        'visits/visitType'
      )
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.visitTypes = response.data; 
          } else {
            this.openSnackBar('Failed to load visit types', 'error');
          }
        },
        error: (err) => {
          console.error('Error fetching visit types:', err);
          this.openSnackBar('Error fetching visit types', 'error');
        },
      });
  }
  
  onSubmit(): void {
    this.submitted = true;
  
    if (this.visitForm.valid) {
      const formData = this.visitForm.value;
  
      const partySl = localStorage.getItem('userId');
      const parsedPartySl = partySl ? parseInt(partySl, 10) : null;
  
      if (!parsedPartySl || isNaN(parsedPartySl)) {
        console.error('Invalid or missing User ID in localStorage!');
        this.openSnackBar('Failed to get valid user ID', 'error');
        this.submitted = false;
        return;
      }
  
      const payload = {
        party_sl: Number(formData.party_sl), 
        shedule_date: formData.visitDate.toISOString().split('T')[0], 
        actual_visit_date: new Date().toISOString().split('T')[0],
        visit_type: Number(formData.visitType), 
        shedule_type: 1, 
        assigned_for: Number(formData.inspector),
        status: 1,
        nar: formData.remarks?.trim() || 'Test', 
      };
      console.log('Payload being sent:', payload);

      this.apiService.postRequest<ApiResponse>('visits/sheduleVisit', payload).subscribe({
        next: (response: ApiResponse) => {
          console.log('Full API Response:', response); 
        
          if (response.status) {
            this.openSnackBar(response.message || 'Visit scheduled successfully', 'success');
            this.visitForm.reset({ visitDate: this.today });
            this.submitted = false;
          } else {
            console.error('API Error:', response.message);
            this.openSnackBar(response.message || 'Failed to schedule visit', 'error');
          }
        },
        error: (err) => {
          console.error('Error scheduling visit:', err); 
          this.openSnackBar('Error scheduling visit', 'error');
        }
      });
    }
  }
  
  
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: [panelClass],
    });
  }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
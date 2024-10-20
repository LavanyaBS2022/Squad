import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/Materials/material.module';

@Component({
  selector: 'app-create-visit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './create-visit.component.html',
  styleUrls: ['./create-visit.component.scss'],
})
export class CreateVisitComponent implements OnInit {
  visitForm!: FormGroup;
  submitted = false;

  routes = ['Route A', 'Route B', 'Route C'];
  visitTypes = ['Route in visit', 'Regular visit', 'Customer complaint', 'Marketing department complaint'];
  inspectors = ['Inspector 1', 'Inspector 2', 'Inspector 3'];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.visitForm = this.fb.group({
      route: ['', Validators.required],
      visitDate: ['', Validators.required],
      visitType: ['', Validators.required],
      inspector: ['', Validators.required],
      remarks: [''],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.visitForm.valid) {
      console.log('Form Data:', this.visitForm.value);
      this.openSnackBar('Visit created successfully', 'success');
      this.visitForm.reset();
      this.submitted = false;
    }
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: [panelClass],
    });
  }
}

import { Component } from '@angular/core';
import { SpinnerService } from '../../../core/services/spinner service/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  constructor(public spinnerService: SpinnerService) {}

}

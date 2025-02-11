import { Component, Input, Output, EventEmitter, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MaterialModule } from '../../Materials/material.module';

@Component({
  selector: 'app-searchable-dropdown',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './searchable-dropdown.component.html',
  styleUrls: ['./searchable-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableDropdownComponent),
      multi: true,
    },
  ],
})
export class SearchableDropdownComponent implements ControlValueAccessor, OnChanges {
  @Input() label: string = 'Select';
  @Input() options: any[] = [];
  @Input() displayKey: string = 'name';
  @Input() valueKey: string = 'sl_no';
  @Input() placeholder: string = 'Search...';

  filteredOptions: any[] = [];
  selectedValue: any = null;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor() {}

  ngOnInit() {
    this.filteredOptions = this.options;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options'] && changes['options'].currentValue) {
      this.filteredOptions = [...this.options];
    }
  }

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  filterOptions(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredOptions = this.options.filter(option =>
      option[this.displayKey]?.toLowerCase().includes(searchTerm)
    );
  }

  selectOption(value: any) {
    this.selectedValue = value;
    this.onChange(value);
  }
}

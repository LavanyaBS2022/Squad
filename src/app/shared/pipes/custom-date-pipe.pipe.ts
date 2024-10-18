import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDatePipe'
})
export class CustomDatePipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

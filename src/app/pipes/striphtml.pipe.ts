import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'striphtml'
})

export class StriphtmlPipe implements PipeTransform {
  transform(value: string): any {
    return value.replace(/<.*?>/g, '').slice(0, 100) + " (More...)"; // replace tags
  }
}
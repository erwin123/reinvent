import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortdesc'
})
export class SortdescPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.sort((a, b) => {
      if (a.Id < b.Id) {
        return 1;
      } else if (a.Id > b.Id) {
        return -1;
      } else {
        return 0;
      }
    })
  }

}

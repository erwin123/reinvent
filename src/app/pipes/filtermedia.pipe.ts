import { Pipe, PipeTransform } from '@angular/core';
import * as globalVar from '../global';

@Pipe({
  name: 'filtermedia'
})
export class FiltermediaPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if(value.indexOf("http") >=0)
    {
      return value;
    }else{
      return globalVar.global_url +"assets/picture/"+value;
    }
    return null;
  }

}

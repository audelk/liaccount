import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;

searchText = searchText.toLowerCase();

return items.filter( it => {
      if(it.first_name.toLowerCase().includes(searchText) || it.middle_name.toLowerCase().includes(searchText) ||it.last_name.toLowerCase().includes(searchText))
        return true;
      else return false;
    });
   }
}
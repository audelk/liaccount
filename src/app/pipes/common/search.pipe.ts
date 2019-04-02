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
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;

searchText = searchText.toLowerCase();

return items.filter( it => {
      return it.toLowerCase().includes(searchText);
    });
   }
}
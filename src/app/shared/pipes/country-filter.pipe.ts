import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryfilter'
})

export class CountryFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) { return []; }
    if (!searchText) { return items; }
    searchText = searchText.toLowerCase();
    return items.filter( it => {
      return it.country.toLowerCase().includes(searchText);
    });
   }
}

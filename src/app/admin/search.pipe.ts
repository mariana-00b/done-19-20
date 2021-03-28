import { Pipe, PipeTransform } from '@angular/core';
import { ICategory } from '../shared/interfacees/category/category.interface';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: ICategory[], field: string): ICategory[] {
    if (!items) return [];
    if (!field) return items;
    return items.filter((item) =>
    item.name.toLowerCase().includes(field.toLowerCase())
    );
  }

}

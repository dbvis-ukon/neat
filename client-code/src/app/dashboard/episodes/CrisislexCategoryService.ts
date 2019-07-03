import {Injectable} from '@angular/core';
import {CrisisLexCategory} from '@app/dashboard/episodes/CrisisLexCategory';
import {from, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
  })
export class CrisislexCategoriesService {
  private _crisisLexCategories = [
    new CrisisLexCategory('T01', 'Caution and Advice'),
    new CrisisLexCategory('T02', 'Injured People'),
    new CrisisLexCategory('T03', 'Dead People'),
    new CrisisLexCategory('T04', 'Infrastructure Damage'),
    new CrisisLexCategory('T05', 'Money'),
    new CrisisLexCategory('T06', 'Supplies needed or offered'),
    new CrisisLexCategory('T07', 'Services needed or offered'),
    new CrisisLexCategory('T08', 'Missing, found, or trapped people'),
    new CrisisLexCategory('T09', 'Displaced and evacuated people'),
    new CrisisLexCategory('T10', 'Animal management'),
    new CrisisLexCategory('T11', 'Personal updates, sympathy'),
    new CrisisLexCategory('C01', 'Children and education'),
    new CrisisLexCategory('C02', 'Food and nutrition'),
    new CrisisLexCategory('C03', 'Health'),
    new CrisisLexCategory('C04', 'Logistics and Transportation'),
    new CrisisLexCategory('C05', 'Camp and shelter'),
    new CrisisLexCategory('C06', 'Water, sanitation, hygiene'),
    new CrisisLexCategory('C07', 'Safety and security'),
    new CrisisLexCategory('C08', 'Telecommunications'),
    new CrisisLexCategory('O01', 'Weather'),
    new CrisisLexCategory('O02', 'Response agencies in place'),
    new CrisisLexCategory('O03', 'Witnesses\' accounts'),
    new CrisisLexCategory('O04', 'Impact of the crisis'),
  ];


  get categories(): Observable<CrisisLexCategory> {
    return from(this._crisisLexCategories.filter(c => c.code.startsWith('C0')));
  }
}

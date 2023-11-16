// group.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private selectedGroupSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  // Observable to subscribe to changes in the selected group
  selectedGroup$ = this.selectedGroupSubject.asObservable();

  constructor() {}

  // Set the selected group
  setSelectedGroup(selectedGroup: string) {
    this.selectedGroupSubject.next(selectedGroup);
  }

  // Additional methods or logic can be added as needed
}

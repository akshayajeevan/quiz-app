import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject('');
  currentView = this.messageSource.asObservable();

  constructor() { }

  setCurrentView(message: string) {
    this.messageSource.next(message);
  }

}

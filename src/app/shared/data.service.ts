import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject('');
  currentView = this.messageSource.asObservable();

  constructor(private http: HttpClient) { }

  setCurrentView(message: string) {
    this.messageSource.next(message);
  }

  getIPDetails() {
    return this.http.get('http://ip-api.com/json/');
  }

  callGeocodeApi(apiKey: string, latitude: string, longitude: string) {
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + apiKey);
  }

}

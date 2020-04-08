import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  randomNo = Math.floor(Math.random() * 100);
  dailyTimelineUrl = 'https://pomber.github.io/covid19/timeseries.json';
  indiaRegDataUrl = 'https://api.rootnet.in/covid19-in/stats/latest';

  constructor(private http: HttpClient) { }

  // getUserDetails() {
  //   return this.http.get('http://localhost:3000/test');
  // }

  getQuizData() {
    return this.http.get('app/shared/quiz-data.json');
  }

  getDailyData() {
    return this.http.get(this.dailyTimelineUrl + '?' + this.randomNo);
  }

  getIndiaRegionalData() {
    return this.http.get(this.indiaRegDataUrl + '?' + this.randomNo);
  }
}

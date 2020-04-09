import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  randomNo = Math.floor(Math.random() * 100);

  dailyTimelineUrl = 'https://pomber.github.io/covid19/timeseries.json';
  indiaRegDataUrl = 'https://api.rootnet.in/covid19-in/stats/latest' + '?' + this.randomNo;
  // tslint:disable-next-line: max-line-length
  germanyRegDataUrl = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Kilometer&returnGeodetic=false&outFields=*&returnGeometry=false&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=none&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=';

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

  getRegionalData(selectedCountry: string) {
    let url = null;
    if (selectedCountry === 'Germany') {
      url = this.germanyRegDataUrl;
    }
    if (selectedCountry === 'India') {
      url = this.indiaRegDataUrl;
    }
    return this.http.get(url);
  }
}

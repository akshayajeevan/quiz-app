import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { HomeService } from '../home/home.service';

declare const gapi: any;
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title = 'COVID-19 Info';
  covidGlobalCounts: any;
  covidCountryCount: {country: string, confirmed: number, deaths: number, recovered: number}[] = [];

  @Input() inputSideNav: MatSidenav;

  worldEmoji = '&#127757;';
  sadFaceEmoji = '&#128543;';

  constructor(private homeService: HomeService) {

  }

  ngOnInit() {
    this.homeService.getDailyData().subscribe(response => {
      this.calculateGlobalCounts(response);
    }, error => {
      $('#error-modal').modal('show');
    });
   }

   calculateGlobalCounts(response: any) {
    const countries = Object.keys(response);
    const globalCounts = {
      globalConfirmed: 0,
      globalDeaths: 0,
      globalRecovered: 0,
      lastRefreshedDate: ''
    };
    countries.forEach(country => {
      const singleCountryData = response[country];
      globalCounts.globalConfirmed += singleCountryData[singleCountryData.length - 1].confirmed;
      globalCounts.globalDeaths += singleCountryData[singleCountryData.length - 1].deaths;
      globalCounts.globalRecovered += singleCountryData[singleCountryData.length - 1].recovered;
      globalCounts.lastRefreshedDate = singleCountryData[singleCountryData.length - 1].date;
      const countryData = {
        country,
        confirmed: singleCountryData[singleCountryData.length - 1].confirmed,
        deaths: singleCountryData[singleCountryData.length - 1].deaths,
        recovered: singleCountryData[singleCountryData.length - 1].recovered
      };
      this.covidCountryCount.push(countryData);
    });
    this.covidGlobalCounts = globalCounts;
    this.covidCountryCount = this.covidCountryCount.sort((a, b) => {
      return (b.confirmed - a.confirmed);
    });
  }
}

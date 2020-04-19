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
  worldEmoji = '&#127757;';
  covidGlobalCounts: any;

  @Input() inputSideNav: MatSidenav;

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
    });
    this.covidGlobalCounts = globalCounts;
  }
}

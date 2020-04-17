import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HomeService } from './home.service';
import { DecimalPipe } from '@angular/common';
import covidCountryInfo from '../shared/covid-19-data.json';
import Chart from 'chart.js';
import { DataService } from '../shared/data.service';
import { HeaderComponent } from '../header/header.component';
import { TweetSheetComponent } from '../tweet-sheet/tweet-sheet.component';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  // default country selector
  selectedCountry = 'India';
  // chart variables
  dailyChart: any;
  regionalChart: any;
  // global varibales for data
  allCountryDailyData: any;
  regionalData: any;
  selectedCountryLatestData: any;
  regLastRefreshed: any;
  usefulInfo: any;

  callEmoji = '&#128222;';
  infoEmoji = '&#128220;';

  // canvas elements
  @ViewChild('dailycanvas', { static: true }) dailyCanvas: ElementRef;
  @ViewChild('regionalcanvas', { static: true }) regionalCanvas: ElementRef;

  constructor(private homeService: HomeService, private decimalPipe: DecimalPipe, private bottomSheet: MatBottomSheet) {

  }

  ngOnInit() {
    this.usefulInfo = covidCountryInfo[this.selectedCountry];
    this.homeService.getDailyData().subscribe(response => {
      // response['US'].forEach(({ date, confirmed, recovered, deaths }) =>
      //   console.log(`${date} confirmed cases: ${confirmed} recovered: ${recovered} deaths: ${deaths}`)
      // );
      this.allCountryDailyData = response;
      this.showDailyChartLine();
    });
    this.homeService.getRegionalData(this.selectedCountry).subscribe(response => {
      this.regionalData = response;
      this.showRegionalChart(); // comment
    });
  }

  ngAfterViewInit() {
    // @ts-ignore
    twttr.widgets.load();
  }

  countryChange() {
    console.log('Selected Country=' + this.selectedCountry);
    this.usefulInfo = covidCountryInfo[this.selectedCountry];
    this.updateDailyChartLine();
    this.homeService.getRegionalData(this.selectedCountry).subscribe(response => {
      this.regionalData = response;
      this.updateRegionalData();
    });
  }

  /**
   * @deprecated for now
   */
  showDailyChart() {
    this.homeService.getDailyData().subscribe(response => {
      const myCountryData = response[this.selectedCountry];
      const confirmedData = [];
      const deathData = [];
      const xlabelsForChart = [];
      for (const dayData of myCountryData) {
        confirmedData.push({x: dayData.date, y: dayData.confirmed});
        deathData.push({x: dayData.date, y: dayData.deaths});
        xlabelsForChart.push(dayData.date);
      }
      this.selectedCountryLatestData = {
        confirmed: myCountryData[myCountryData.length - 1].confirmed,
        deaths: myCountryData[myCountryData.length - 1].deaths,
        recovered: myCountryData[myCountryData.length - 1].recovered,
        deathRate: 0,
        recoveryRate: 0,
        lastRefreshedDate: xlabelsForChart[xlabelsForChart.length - 1]
      };
      this.dailyChart = new Chart(this.dailyCanvas.nativeElement.getContext('2d'), {
        type: 'bar',
        data: {
          labels: xlabelsForChart,
          datasets: [{
            label: 'Confirmed',
            data: confirmedData,
            backgroundColor: '#FB475E'
          },
          {
            label: 'Deaths',
            data: deathData,
            backgroundColor: '#13293D'
          }]
        },
        options: {
          legend: { display: false },
          title: {
            display: false,
            text: 'Daily cases for ' + this.selectedCountry
          },
          scales: {
            xAxes: [{
              stacked: true,
              type: 'time',
              distribution: 'linear',
              time: {
                tooltipFormat: 'MMM DD',
                displayFormats: {
                  millisecond: 'MMM DD',
                  second: 'MMM DD',
                  minute: 'MMM DD',
                  hour: 'MMM DD',
                  day: 'MMM DD',
                  week: 'MMM DD',
                  month: 'MMM DD',
                  quarter: 'MMM DD',
                  year: 'MMM DD',
                }
              },
              gridLines: {
                drawOnChartArea: false
              }
            }],
            yAxes: [{
              stacked: true
            }]
          }
        }
      });
    });
  }

  /**
   * Show Daily cases in line chart
   */
  showDailyChartLine() {
    Chart.defaults.LineWithLine = Chart.defaults.line;
    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
      // tslint:disable-next-line: object-literal-shorthand
      draw: function(ease) {
          Chart.controllers.line.prototype.draw.call(this, ease);

          if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
            const activePoint = this.chart.tooltip._active[0];
            const ctx = this.chart.ctx;
            const x = activePoint.tooltipPosition().x;
            const topY = this.chart.scales['y-axis-0'].top;
            const bottomY = this.chart.scales['y-axis-0'].bottom;

            // draw line
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#0D659D';
            ctx.stroke();
            ctx.restore();
          }
      }
    });
    const selectedCountryData = this.allCountryDailyData[this.selectedCountry];
    const confirmedData = [];
    const deathData = [];
    const recoveredData = [];
    const xlabelsForChart = [];
    for (const dayData of selectedCountryData) {
      confirmedData.push(dayData.confirmed);
      deathData.push(dayData.deaths);
      recoveredData.push(dayData.recovered);
      xlabelsForChart.push(dayData.date);
    }
    this.selectedCountryLatestData = {
      confirmed: selectedCountryData[selectedCountryData.length - 1].confirmed,
      deaths: selectedCountryData[selectedCountryData.length - 1].deaths,
      recovered: selectedCountryData[selectedCountryData.length - 1].recovered,
      deathRate: 0,
      recoveryRate: 0,
      lastRefreshedDate: xlabelsForChart[xlabelsForChart.length - 1]
    };
    const deathRate = (this.selectedCountryLatestData.deaths / this.selectedCountryLatestData.confirmed) * 100;
    this.selectedCountryLatestData.deathRate = Number(this.decimalPipe.transform(deathRate, '1.2-2'));
    const recoveryRate = (this.selectedCountryLatestData.recovered / this.selectedCountryLatestData.confirmed) * 100;
    this.selectedCountryLatestData.recoveryRate = Number(this.decimalPipe.transform(recoveryRate, '1.2-2'));
    // tslint:disable-next-line: max-line-length
    this.selectedCountryLatestData.lastDayChange = selectedCountryData[selectedCountryData.length - 1].confirmed - selectedCountryData[selectedCountryData.length - 2].confirmed;

    this.dailyChart = new Chart(this.dailyCanvas.nativeElement.getContext('2d'), {
        type: 'LineWithLine',
        data: {
          labels: xlabelsForChart,
          datasets: [
            {
              label: 'Confirmed',
              data: confirmedData,
              backgroundColor: '#FB475E',
              borderColor: '#FB475E',
              fill: false,
              pointRadius: 4
            },
            {
              label: 'Recovered',
              data: recoveredData,
              backgroundColor: '#24BE6C',
              borderColor: '#24BE6C',
              fill: false,
              pointRadius: 3
            },
            {
              label: 'Deaths',
              data: deathData,
              backgroundColor: '#05263B',
              borderColor: '#05263B',
              fill: false,
              pointRadius: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
          tooltips: {
            mode: 'label',  // or 'x-axis',
            intersect: false
          },
          elements: {
            line: {
                borderJoinStyle: 'round'
            }
          },
          scales: {
            xAxes: [{
              type: 'time',
              distribution: 'linear',
              ticks: {
                maxTicksLimit: 12
              },
              time: {
                tooltipFormat: 'MMM DD',
                displayFormats: {
                  millisecond: 'MMM DD',
                  second: 'MMM DD',
                  minute: 'MMM DD',
                  hour: 'MMM DD',
                  day: 'MMM DD',
                  week: 'MMM DD',
                  month: 'MMM DD',
                  quarter: 'MMM DD',
                  year: 'MMM DD',
                }
              },
              gridLines: {
                drawOnChartArea: false
              }
            }],
            yAxes: [{
              ticks: {
                maxTicksLimit: 8
              }
          }]
          }
        }
      });
  }

  /**
   * Update Daily cases chart on country selection
   */
  updateDailyChartLine() {
    const selectedCountryData = this.allCountryDailyData[this.selectedCountry === 'USA' ? 'US' : this.selectedCountry];
    const confirmedData = [];
    const deathData = [];
    const recoveredData = [];
    const xlabelsForChart = [];
    for (const dayData of selectedCountryData) {
      confirmedData.push(dayData.confirmed);
      deathData.push(dayData.deaths);
      recoveredData.push(dayData.recovered);
      xlabelsForChart.push(dayData.date);
    }
    this.selectedCountryLatestData = {
      confirmed: selectedCountryData[selectedCountryData.length - 1].confirmed,
      deaths: selectedCountryData[selectedCountryData.length - 1].deaths,
      recovered: selectedCountryData[selectedCountryData.length - 1].recovered,
      deathRate: 0,
      recoveryRate: 0,
      lastRefreshedDate: xlabelsForChart[xlabelsForChart.length - 1]
    };
    const deathRate = (this.selectedCountryLatestData.deaths / this.selectedCountryLatestData.confirmed) * 100;
    this.selectedCountryLatestData.deathRate = Number(this.decimalPipe.transform(deathRate, '1.2-2'));
    const recoveryRate = (this.selectedCountryLatestData.recovered / this.selectedCountryLatestData.confirmed) * 100;
    this.selectedCountryLatestData.recoveryRate = Number(this.decimalPipe.transform(recoveryRate, '1.2-2'));
    // tslint:disable-next-line: max-line-length
    this.selectedCountryLatestData.lastDayChange = selectedCountryData[selectedCountryData.length - 1].confirmed - selectedCountryData[selectedCountryData.length - 2].confirmed;

    this.dailyChart.data.labels = xlabelsForChart;
    this.dailyChart.data.datasets[0].data = confirmedData;
    this.dailyChart.data.datasets[1].data = recoveredData;
    this.dailyChart.data.datasets[2].data = deathData;

    this.dailyChart.update();
  }

  /**
   * Show no of cases of states on horizontal bar
   */
  showRegionalChart() {
    // console.log(response);
    this.regLastRefreshed = this.regionalData.lastRefreshed;
    if (this.regionalData.success) {
      const regData: any = this.regionalData.data;
      const sortedRegionalData = regData.regional.sort((a, b) => {
        const aTotal = a.totalConfirmed;
        const bTotal = b.totalConfirmed;
        return (bTotal - aTotal);
      });
      const ylabelsForChart = [];
      const confirmedCases = [];
      const discharged = [];
      const deaths = [];
      for (const region of sortedRegionalData) {
        ylabelsForChart.push(region.loc);
        confirmedCases.push(region.totalConfirmed);
        discharged.push(region.discharged);
        deaths.push(region.deaths);
      }
      this.regionalChart = new Chart(this.regionalCanvas.nativeElement.getContext('2d'), {
        type: 'horizontalBar',
        data: {
          labels: ylabelsForChart,
          datasets: [{
            label: 'Confirmed',
            data: confirmedCases,
            backgroundColor: '#FB475E',
            barThickness: 10
          },
          {
            label: 'Discharged',
            data: discharged,
            backgroundColor: '#24BE6C',
            barThickness: 10
          },
          {
            label: 'Deaths',
            data: deaths,
            backgroundColor: '#05263B',
            barThickness: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
          tooltips: {
            intersect: false
          },
          scales: {
            xAxes: [{
              stacked: true,
              gridLines: {
                drawOnChartArea: false
              },
              ticks: {
                maxTicksLimit: 8
              }
            }],
            yAxes: [{
              minBarLength: 5,
              stepSize: 1,
              stacked: true,
              gridLines: {
                drawOnChartArea: false
              },
              ticks: {
                autoSkip: false
              }
            }]
          }
        }
      });
    } else {

    }
  }

  /**
   * Update states cases chart on country selection
   */
  updateRegionalData() {
    const ylabelsForChart = [];
    const confirmedCases = [];
    const discharged = [];
    const deaths = [];
    if (this.selectedCountry === 'India') {
      this.regLastRefreshed = this.regionalData.lastRefreshed;
      const regData: any = this.regionalData.data;
      const sortedRegionalData = regData.regional.sort((a, b) => {
        const aTotal = a.totalConfirmed;
        const bTotal = b.totalConfirmed;
        return (bTotal - aTotal);
      });
      for (const region of sortedRegionalData) {
        ylabelsForChart.push(region.loc);
        confirmedCases.push(region.totalConfirmed);
        discharged.push(region.discharged);
        deaths.push(region.deaths);
      }
    }
    if (this.selectedCountry === 'Germany') {
      const sortedRegionalData = this.regionalData.features.sort((a, b) => {
        const aTotal = a.attributes.Fallzahl;
        const bTotal = b.attributes.Fallzahl;
        return (bTotal - aTotal);
      });
      for (const region of sortedRegionalData) {
        ylabelsForChart.push(region.attributes.LAN_ew_GEN);
        confirmedCases.push(region.attributes.Fallzahl);
        // discharged.push('NA');
        deaths.push(region.attributes.Death);
        this.regLastRefreshed = region.attributes.Aktualisierung;
      }
    }

    if (this.selectedCountry === 'USA') {
      const states = Object.keys(this.regionalData);
      const regData = [];
      states.forEach(state => {
        if (state !== 'lastRefreshed') {
          const stateData = this.regionalData[state];
          const lastData = stateData[stateData.length - 1];
          regData.push({loc: state, data: lastData});
        }
      });
      const sortedRegionalData = regData.sort((a, b) => {
        const aTotal = a.data.confirmed;
        const bTotal = b.data.confirmed;
        return (bTotal - aTotal);
      });
      for (const region of sortedRegionalData) {
        ylabelsForChart.push(region.loc);
        confirmedCases.push(region.data.confirmed);
        deaths.push(region.data.deaths);
        this.regLastRefreshed = region.data.date;
      }
    }

    this.regionalChart.data.labels = ylabelsForChart;
    this.regionalChart.data.datasets[0].data = confirmedCases;
    this.regionalChart.data.datasets[1].data = discharged;
    this.regionalChart.data.datasets[2].data = deaths;
    this.regionalChart.update();
  }

  openTweetSheet() {
    const config: MatBottomSheetConfig = {
      data: this.selectedCountry
    };
    this.bottomSheet.open(TweetSheetComponent, config);
  }

}

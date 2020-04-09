import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HomeService } from './home.service';
import { DecimalPipe } from '@angular/common';
import covidCountryInfo from '../shared/covid-19-data.json';
import Chart from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // default country selector
  selectedCountry = 'India';
  // chart variables
  dailyChart: any;
  regionalChart: any;
  // global varibales for data
  allCountryDailyData: any;
  regionalData: any;
  selectedCountryLatestData = {
    confirmed: 0,
    deaths: 0,
    recovered: 0,
    deathRate: 0,
    recoveryRate: 0,
    lastRefreshedDate: ''
  };
  regLastRefreshed: any;
  usefulInfo: any;

  // canvas elements
  @ViewChild('dailycanvas', { static: true }) dailyCanvas: ElementRef;
  @ViewChild('regionalcanvas', { static: true }) regionalCanvas: ElementRef;

  constructor(private homeService: HomeService, private decimalPipe: DecimalPipe) {

  }

  ngOnInit() {
    this.usefulInfo = covidCountryInfo[this.selectedCountry];
    this.homeService.getDailyData().subscribe(response => {
      // response[this.myCountry].forEach(({ date, confirmed, recovered, deaths }) =>
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
              ticks: {
                maxTicksLimit: 8
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
              pointRadius: 3
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
            mode: 'label'  // or 'x-axis'
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

  updateDailyChartLine() {
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

    this.dailyChart.data.labels = xlabelsForChart;
    this.dailyChart.data.datasets[0].data = confirmedData;
    this.dailyChart.data.datasets[1].data = recoveredData;
    this.dailyChart.data.datasets[2].data = deathData;

    this.dailyChart.update();
  }

  /**
   * Show no of cases of Indian states on horizontal bar
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
            backgroundColor: '#FB475E'
          },
          {
            label: 'Discharged',
            data: discharged,
            backgroundColor: '#24BE6C'
          },
          {
            label: 'Deaths',
            data: deaths,
            backgroundColor: '#05263B'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
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
              barThickness: 10,
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

    this.regionalChart.data.labels = ylabelsForChart;
    this.regionalChart.data.datasets[0].data = confirmedCases;
    this.regionalChart.data.datasets[1].data = discharged;
    this.regionalChart.data.datasets[2].data = deaths;
    this.regionalChart.update();
  }

}

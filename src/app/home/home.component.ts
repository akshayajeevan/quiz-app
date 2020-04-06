import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HomeService } from './home.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import Chart from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loggedInUser: any = {};
  catergoryList: any;

  myCountry = 'India';
  myCountryLatestData = {
    confirmed: 0,
    deaths: 0,
    recovered: 0
  };
  indiaSummary: any;
  indiaRegLastRefreshed: [];

  @ViewChild('myCanvas', { static: true }) myCanvas: ElementRef;
  @ViewChild('indiaregional', { static: true }) indiaRegional: ElementRef;

  constructor(private homeService: HomeService, private datePipe: DatePipe) {

  }

  ngOnInit() {
    // this.homeService.getUserDetails().subscribe(response => {
    //   console.log(response);
    //   if (!!response) {
    //     this.loggedInUser = response[0];
    //   }
    // });
    // Chart.plugins.register({
    //   beforeDraw: function(chartInstance) {
    //     const ctx = chartInstance.chart.ctx;
    //     ctx.fillStyle = 'white';
    //     ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
    //   }
    // });
    // this.showDailyChart();
    this.showDailyChartArea();
    this.showIndiaRegionalChart();
  }

  showDailyChart() {
    this.homeService.getDailyData().subscribe(response => {
      response[this.myCountry].forEach(({ date, confirmed, recovered, deaths }) =>
        console.log(`${date} confirmed cases: ${confirmed} recovered: ${recovered} deaths: ${deaths}`)
      );
      // let lastDate = new Date();
      // lastDate.setDate(lastDate.getDate() - 1);
      // let today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      // let yesterday = this.datePipe.transform(lastDate, 'yyyy-MM-dd');
      const myCountryData = response[this.myCountry];
      const confirmedData = [];
      const deathData = [];
      const xlabelsForChart = [];
      for (const dayData of myCountryData) {
        confirmedData.push({x: dayData.date, y: dayData.confirmed});
        deathData.push({x: dayData.date, y: dayData.deaths});
        xlabelsForChart.push(dayData.date);
      }
      this.myCountryLatestData = {
        confirmed: myCountryData[myCountryData.length - 1].confirmed,
        deaths: myCountryData[myCountryData.length - 1].deaths,
        recovered: myCountryData[myCountryData.length - 1].recovered
      };
      const chart = new Chart(this.myCanvas.nativeElement.getContext('2d'), {
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
            text: 'No of Confirmed case for ' + this.myCountry
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

  showDailyChartArea() {
    this.homeService.getDailyData().subscribe(response => {
      // response[this.myCountry].forEach(({ date, confirmed, recovered, deaths }) =>
      //   console.log(`${date} confirmed cases: ${confirmed} recovered: ${recovered} deaths: ${deaths}`)
      // );
      const myCountryData = response[this.myCountry];
      const confirmedData = [];
      const deathData = [];
      const xlabelsForChart = [];
      for (const dayData of myCountryData) {
        confirmedData.push(dayData.confirmed);
        deathData.push(dayData.deaths);
        xlabelsForChart.push(dayData.date);
      }
      this.myCountryLatestData = {
        confirmed: myCountryData[myCountryData.length - 1].confirmed,
        deaths: myCountryData[myCountryData.length - 1].deaths,
        recovered: myCountryData[myCountryData.length - 1].recovered
      };
      const chart = new Chart(this.myCanvas.nativeElement.getContext('2d'), {
        type: 'line',
        data: {
          labels: xlabelsForChart,
          datasets: [
          {
            label: 'Deaths',
            data: deathData,
            backgroundColor: '#13293D',
            fill: 'origin',
            pointRadius: 0,
            cubicInterpolationMode: 'default'
          },
          {
            label: 'Confirmed',
            data: confirmedData,
            backgroundColor: '#FB475E',
            fill: '-1',
            pointRadius: 1,
            cubicInterpolationMode: 'default'
          }]
        },
        options: {
          legend: { display: false },
          title: {
            display: false,
            text: 'No of Confirmed case for ' + this.myCountry
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
              stacked: true
          }]
          }
        }
      });
    });
  }

  showIndiaRegionalChart() {
    this.homeService.getIndiaRegionalData().subscribe(response => {
      // console.log(response);
      const ylabelsForChart = [];
      this.indiaRegLastRefreshed = response['lastRefreshed'];
      if (response['success']) {
        const indiaRegData: any = response['data'];
        this.indiaSummary = indiaRegData.summary;
        const sortedRegionalData = indiaRegData.regional.sort((a, b) => {
          const aTotal = a.confirmedCasesIndian + a.discharged + a.deaths + a.confirmedCasesForeign;
          const bTotal = b.confirmedCasesIndian + b.discharged + b.deaths + b.confirmedCasesForeign;
          return (bTotal - aTotal);
        });
        const confirmedCasesIndian = [];
        const confirmedCasesForeign = [];
        const discharged = [];
        const deaths = [];
        for (const region of sortedRegionalData) {
          ylabelsForChart.push(region.loc);
          confirmedCasesIndian.push(region.confirmedCasesIndian);
          confirmedCasesForeign.push(region.confirmedCasesForeign);
          discharged.push(region.discharged);
          deaths.push(region.deaths);
        }

        const chart = new Chart(this.indiaRegional.nativeElement.getContext('2d'), {
          type: 'horizontalBar',
          data: {
            labels: ylabelsForChart,
            datasets: [{
              label: 'Indians Confirmed',
              data: confirmedCasesIndian,
              backgroundColor: '#FB475E'
            },
            {
              label: 'Foreigners Confirmed',
              data: confirmedCasesForeign,
              backgroundColor: '#FFB001'
            },
            {
              label: 'Discharged',
              data: discharged,
              backgroundColor: '#4CB944'
            },
            {
              label: 'Deaths',
              data: deaths,
              backgroundColor: '#13293D'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: { display: false },
            title: {
              display: false,
              text: 'No of Cases for Indian States'
            },
            scales: {
              xAxes: [{
                stacked: true,
                gridLines: {
                  drawOnChartArea: false
                }
              }],
              yAxes: [{
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
    });
  }

}

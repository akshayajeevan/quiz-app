import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HomeService } from './home.service';
import { DecimalPipe } from '@angular/common';
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
    recovered: 0,
    deathRate: 0,
    recoveryRate: 0,
    lastRefreshedDate: ''
  };
  indiaSummary: any;
  indiaRegLastRefreshed: [];

  @ViewChild('myCanvas', { static: true }) myCanvas: ElementRef;
  @ViewChild('indiaregional', { static: true }) indiaRegional: ElementRef;

  constructor(private homeService: HomeService, private decimalPipe: DecimalPipe) {

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
    this.showDailyChartLine();
    this.showIndiaRegionalChart();
  }

  showDailyChart() {
    this.homeService.getDailyData().subscribe(response => {
      // response[this.myCountry].forEach(({ date, confirmed, recovered, deaths }) =>
      //   console.log(`${date} confirmed cases: ${confirmed} recovered: ${recovered} deaths: ${deaths}`)
      // );
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
        recovered: myCountryData[myCountryData.length - 1].recovered,
        deathRate: 0,
        recoveryRate: 0,
        lastRefreshedDate: xlabelsForChart[xlabelsForChart.length - 1]
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

  /**
   * Show Daily cases in line chart
   */
  showDailyChartLine() {
    Chart.defaults.LineWithLine = Chart.defaults.line;
    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
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
    this.homeService.getDailyData().subscribe(response => {
      // response[this.myCountry].forEach(({ date, confirmed, recovered, deaths }) =>
      //   console.log(`${date} confirmed cases: ${confirmed} recovered: ${recovered} deaths: ${deaths}`)
      // );
      const myCountryData = response[this.myCountry];
      const confirmedData = [];
      const deathData = [];
      const recoveredData = [];
      const xlabelsForChart = [];
      for (const dayData of myCountryData) {
        confirmedData.push(dayData.confirmed);
        deathData.push(dayData.deaths);
        recoveredData.push(dayData.recovered);
        xlabelsForChart.push(dayData.date);
      }
      this.myCountryLatestData = {
        confirmed: myCountryData[myCountryData.length - 1].confirmed,
        deaths: myCountryData[myCountryData.length - 1].deaths,
        recovered: myCountryData[myCountryData.length - 1].recovered,
        deathRate: 0,
        recoveryRate: 0,
        lastRefreshedDate: xlabelsForChart[xlabelsForChart.length - 1]
      };
      const deathRate = (this.myCountryLatestData.deaths / this.myCountryLatestData.confirmed) * 100;
      this.myCountryLatestData.deathRate = Number(this.decimalPipe.transform(deathRate, '1.2-2'));
      const recoveryRate = (this.myCountryLatestData.recovered / this.myCountryLatestData.confirmed) * 100;
      this.myCountryLatestData.recoveryRate = Number(this.decimalPipe.transform(recoveryRate, '1.2-2'));
      const chart = new Chart(this.myCanvas.nativeElement.getContext('2d'), {
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
              pointRadius: 2
            },
            {
              label: 'Recovered',
              data: recoveredData,
              backgroundColor: '#4CB944',
              borderColor: '#4CB944',
              fill: false,
              pointRadius: 2
            },
            {
              label: 'Deaths',
              data: deathData,
              backgroundColor: '#13293D',
              borderColor: '#13293D',
              fill: false,
              pointRadius: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
          title: {
            display: false,
            text: 'No of Confirmed case for ' + this.myCountry
          },
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
    });
  }

  /**
   * Show no of cases of Indian states on horizontal bar
   */
  showIndiaRegionalChart() {
    this.homeService.getIndiaRegionalData().subscribe(response => {
      // console.log(response);
      const ylabelsForChart = [];
      // tslint:disable-next-line: no-string-literal
      this.indiaRegLastRefreshed = response['lastRefreshed'];
      // tslint:disable-next-line: no-string-literal
      if (response['success']) {
        // tslint:disable-next-line: no-string-literal
        const indiaRegData: any = response['data'];
        // tslint:disable-next-line: no-string-literal
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
            maintainAspectRatio: false,
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
                barThickness: 10,
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

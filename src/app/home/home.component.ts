import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HomeService } from './home.service';
import { DecimalPipe } from '@angular/common';
import covidCountryInfo from '../shared/covid-19-data.json';
import Chart from 'chart.js';
import { TweetSheetComponent } from '../tweet-sheet/tweet-sheet.component';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { ChartType } from 'angular-google-charts';

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
  selectedCountryLatestData = {
    confirmed: 0,
    deaths: 0,
    recovered: 0,
    lastRefreshedDate: '',
    lastDayChange: 0,
    deathRate: 0,
    recoveryRate: 0
  };
  regLastRefreshed: any;
  usefulInfo: any;
  minimumCasesiInChart = 100;

  callEmoji = '&#128222;';
  infoEmoji = '&#128220;';
  // Google chart variables
  gChartTypeState = ChartType.GeoChart;
  gChartStateData: any;
  gChartStateOptions: any;

  // canvas elements
  @ViewChild('dailycanvas', { static: true }) dailyCanvas: ElementRef;
  @ViewChild('regionalcanvas', { static: true }) regionalCanvas: ElementRef;

  localeToUse = this.localeToUse;

  constructor(private homeService: HomeService, private decimalPipe: DecimalPipe, private bottomSheet: MatBottomSheet) {

  }

  ngOnInit() {
    // tslint:disable-next-line: quotemark
    Chart.defaults.global.defaultFontFamily = "'Open Sans', sans-serif";
    // Chart.defaults.global.defaultFontSize = 8;
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

    this.gChartStateData = [
      ['State', 'Popularity'],
      ['Andhra Pradesh', 200],
      ['Arunachal Pradesh', 130],
      ['Assam', 100],
      ['Bihar', 180],
      ['Chhattisgarh', 100],
      ['Goa', 250],
      ['Gujarat', 100],
      ['Haryana', 100],
      ['Himachal Pradesh', 90],
      ['Jharkhand', 70],
      ['Karnataka', 400],
      ['Kerala', 500],
    ];
    this.gChartStateOptions = {
      region: 'IN',
      colorAxis: {colors: ['#00853f', 'black', '#e31b23']},
      backgroundColor: '#81d4fa',
      datalessRegionColor: '#f8bbd0',
      defaultColor: '#f5f5f5',
      displayMode: 'markers',
      resolution: 'provinces',
    };
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
        lastRefreshedDate: xlabelsForChart[xlabelsForChart.length - 1],
        lastDayChange: 0
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
    // below code to show vertical line on mouse hover
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
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = '#B3B3B3';
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
      if (dayData.confirmed > this.minimumCasesiInChart) {
        confirmedData.push(dayData.confirmed);
        deathData.push(dayData.deaths);
        recoveredData.push(dayData.recovered);
        xlabelsForChart.push(dayData.date);
      }
    }
    this.selectedCountryLatestData = {
      confirmed: selectedCountryData[selectedCountryData.length - 1].confirmed,
      deaths: selectedCountryData[selectedCountryData.length - 1].deaths,
      recovered: selectedCountryData[selectedCountryData.length - 1].recovered,
      deathRate: 0,
      recoveryRate: 0,
      lastRefreshedDate: xlabelsForChart[xlabelsForChart.length - 1],
      lastDayChange: 0
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
              backgroundColor: '#FC6D7F',
              borderColor: '#FC6D7F',
              fill: 1,
              pointRadius: 1,
              borderWidth: 1
            },
            {
              label: 'Recovered',
              data: recoveredData,
              backgroundColor: '#45D286',
              borderColor: '#45D286',
              fill: 2,
              pointRadius: 1,
              borderWidth: 1
            },
            {
              label: 'Deaths',
              data: deathData,
              backgroundColor: '#05263B',
              borderColor: '#05263B',
              fill: true,
              pointRadius: 1,
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
          tooltips: {
            mode: 'label',  // or 'x-axis',
            intersect: false,
            callbacks: {
              label: (tooltipItem, data) => {
                let label = data.datasets[tooltipItem.datasetIndex].label || '';
                if (label) {
                  label += ': ';
                }
                label += tooltipItem.yLabel.toLocaleString(this.localeToUse);
                return label;
              }
            }
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
                maxTicksLimit: 18,
                fontColor: '#05263B',
                fontSize: screen.width < 800 ? 9 : 10
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
              },
              scaleLabel: {
                display: true,
                labelString: `From the day recorded ${this.minimumCasesiInChart} confirmed cases`,
                fontStyle: 'italic'
              }
            }],
            yAxes: [{
              ticks: {
                callback: (value, index, values) => {
                  return value.toLocaleString(this.localeToUse);
                }
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
      if (dayData.confirmed > this.minimumCasesiInChart) {
        confirmedData.push(dayData.confirmed);
        deathData.push(dayData.deaths);
        recoveredData.push(dayData.recovered);
        xlabelsForChart.push(dayData.date);
      }
    }
    this.selectedCountryLatestData = {
      confirmed: selectedCountryData[selectedCountryData.length - 1].confirmed,
      deaths: selectedCountryData[selectedCountryData.length - 1].deaths,
      recovered: selectedCountryData[selectedCountryData.length - 1].recovered,
      deathRate: 0,
      recoveryRate: 0,
      lastRefreshedDate: xlabelsForChart[xlabelsForChart.length - 1],
      lastDayChange: 0
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
      const recovered = [];
      const deaths = [];
      for (const region of sortedRegionalData) {
        // break large state names
        if (region.loc.indexOf('Dadra') !== -1) {
          const idx = region.loc.indexOf('and Daman');
          const str1 = region.loc.substr(0, idx);
          const str2 = region.loc.substr(idx);
          ylabelsForChart.push([str1, str2]);
        } else if (region.loc.indexOf('Andaman') !== -1) {
          const idx = region.loc.indexOf('Nicobar');
          const str1 = region.loc.substr(0, idx);
          const str2 = region.loc.substr(idx);
          ylabelsForChart.push([str1, str2]);
        } else {
          ylabelsForChart.push(region.loc);
        }
        confirmedCases.push(region.totalConfirmed);
        recovered.push(region.discharged);
        deaths.push(region.deaths);
      }
      this.regionalChart = new Chart(this.regionalCanvas.nativeElement.getContext('2d'), {
        type: 'horizontalBar',
        data: {
          labels: ylabelsForChart,
          datasets: [{
            label: 'Confirmed',
            data: confirmedCases,
            backgroundColor: '#FC6D7F',
            barThickness: 10
          },
          {
            label: 'Recovered',
            data: recovered,
            backgroundColor: '#45D286',
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
            intersect: false,
            callbacks: {
              label: (tooltipItem, data) => {
                let label = data.datasets[tooltipItem.datasetIndex].label || '';
                if (label) {
                  label += ': ';
                }
                label += tooltipItem.xLabel.toLocaleString(this.localeToUse);
                return label;
              }
            }
          },
          scales: {
            xAxes: [{
              display: false,  // x-axis is hidden
              stacked: true,
              gridLines: {
                drawOnChartArea: false
              },
              ticks: {
                display: false,
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
                autoSkip: false,
                fontColor: '#05263B',
                fontSize: screen.width < 800 ? 9 : 10
              }
            }]
          }
        }
      });
    } else {
      // to-do
    }
  }

  /**
   * Update states cases chart on country selection
   */
  updateRegionalData() {
    const ylabelsForChart = [];
    const confirmedCases = [];
    const recovered = [];
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
        // break large state names
        if (region.loc.indexOf('Dadra') !== -1) {
          const idx = region.loc.indexOf('and Daman');
          const str1 = region.loc.substr(0, idx);
          const str2 = region.loc.substr(idx);
          ylabelsForChart.push([str1, str2]);
        } else if (region.loc.indexOf('Andaman') !== -1) {
          const idx = region.loc.indexOf('Nicobar');
          const str1 = region.loc.substr(0, idx);
          const str2 = region.loc.substr(idx);
          ylabelsForChart.push([str1, str2]);
        } else {
          ylabelsForChart.push(region.loc);
        }
        confirmedCases.push(region.totalConfirmed);
        recovered.push(region.discharged);
        deaths.push(region.deaths);
      }
      this.regionalChart.data.datasets[0].barThickness = 10;
      this.regionalChart.data.datasets[1].barThickness = 10;
      this.regionalChart.data.datasets[2].barThickness = 10;
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
        // recovered.push('NA');
        deaths.push(region.attributes.Death);
        this.regLastRefreshed = region.attributes.Aktualisierung;
      }
      this.regionalChart.data.datasets[0].barThickness = 10;
      this.regionalChart.data.datasets[1].barThickness = 10;
      this.regionalChart.data.datasets[2].barThickness = 10;
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
      this.regionalChart.data.datasets[0].barThickness = 8;
      this.regionalChart.data.datasets[1].barThickness = 8;
      this.regionalChart.data.datasets[2].barThickness = 8;
    }

    this.regionalChart.data.labels = ylabelsForChart;
    this.regionalChart.data.datasets[0].data = confirmedCases;
    this.regionalChart.data.datasets[1].data = recovered;
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

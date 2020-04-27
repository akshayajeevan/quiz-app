import { Component } from '@angular/core';
import { DataService } from './shared/data.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeService } from './home/home.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'My App';
  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);
  showHeaderFooter = false;

  googleApiKey = 'AIzaSyBM__ubDWijbsndYmZVdKnPMdddtXpBWSI';

  constructor(private data: DataService, private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      `tweet`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/Twitter_Social_Icon_Circle_Color.svg')
    );
    this.data.currentView.subscribe(currentRoute => {
      // console.log(currentRoute);
      // if (currentRoute !== '/login' || currentRoute !== '/') {
      //   this.showHeaderFooter = true;
      // }
    });
    this.getGeoLocationbrowser();
  }

  getGeoLocationbrowser() {
    let isSuccess = false;
    let coordinates = null;
    if ('geolocation' in navigator) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000
      };
      // check if geolocation is supported/enabled on current browser
      navigator.geolocation.getCurrentPosition(
        function success(position) {
          // for when getting location is a success
          console.log('latitude', position.coords.latitude, 'longitude', position.coords.longitude);
          isSuccess = true;
          coordinates = position.coords;
        },
        function error(err) {
          // for when getting location results in an error
          isSuccess = false;
          console.log('An error has occured while retrieving location: ', err.message);
        },
        options
      );
    }
    if (!isSuccess) {
      this.getGeoLocationApi();
    } else {
      this.getLocation(coordinates.latitude, coordinates.longitude);
    }
  }

  getGeoLocationApi() {
    this.data.getIPDetails().subscribe(response => {
      console.log('User\'s Location Data is ', response);
      // @ts-ignore
      const currentRegion = response.regionName;
    });
  }

  getLocation(lat, lang) {
    this.data.callGeocodeApi(this.googleApiKey, lat, lang).subscribe(response => {
      console.log('Google Geocoding API response ', response);
    });
  }

}

import { Component } from '@angular/core';
import { DataService } from './shared/data.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'My App';
  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);
  showHeaderFooter = false;

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
  }



}

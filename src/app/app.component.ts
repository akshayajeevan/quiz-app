import { Component } from '@angular/core';
import { DataService } from './shared/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'My App';
  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);
  showHeaderFooter = false;

  constructor(private data: DataService) {
    this.data.currentView.subscribe(currentRoute => {
      console.log(currentRoute);
      // if (currentRoute !== '/login' || currentRoute !== '/') {
      //   this.showHeaderFooter = true;
      // }
    });
  }



}

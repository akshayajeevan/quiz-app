import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loggedInUser: any = {};

  catergoryList: any;

  constructor(private homeService: HomeService) {
    this.catergoryList = [
      {
        name: 'JavaScipt',
        description: 'Quiz about JavaScript'
      },
      {
        name: 'AngularJS',
        description: 'Quiz about AngularJS'
      },
      {
        name: 'CSS',
        description: 'Quiz about CSS'
      },
    ];
   }

  ngOnInit() {
    this.homeService.getUserDetails().subscribe(response => {
      console.log(response);
      if (!!response) {
        this.loggedInUser = response[0];
      }
    });
  }

  openCategory(name) {
    console.log(name + ' clicked!');
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

declare const gapi: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title = 'COVID 19 Statistics';

  @Input() inputSideNav: MatSidenav;

  constructor() {

  }

  ngOnInit() {  }



}

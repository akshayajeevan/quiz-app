import { Component, AfterViewInit, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-tweet-sheet',
  templateUrl: 'tweet-sheet.component.html',
})
export class TweetSheetComponent implements OnInit, AfterViewInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
                console.log(data);
              }

  ngOnInit() {
    // @ts-ignore
    twttr.widgets.load();
  }

  ngAfterViewInit() {
    // @ts-ignore
    twttr.widgets.load();
  }
}

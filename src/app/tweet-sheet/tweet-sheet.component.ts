import { Component, AfterViewInit, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-tweet-sheet',
  templateUrl: 'tweet-sheet.component.html',
})
export class TweetSheetComponent implements OnInit, AfterViewInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private bottomSheetRef: MatBottomSheetRef<TweetSheetComponent>) {
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

  /**
   * Close the sheet when clicks on X
   */
  closeSheet() {
    this.bottomSheetRef.dismiss();
  }
}

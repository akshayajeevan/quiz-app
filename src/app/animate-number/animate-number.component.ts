import { Component, ElementRef, Input, AfterViewInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-animate-number',
  templateUrl: 'animate-number.component.html'
})
export class AnimateNumerComponent implements AfterViewInit, OnChanges {

  @Input() localeToUse: string;
  @Input() duration: number;
  @Input() digit: number;
  @Input() steps: number;
  @ViewChild('animateNumber', { static: true }) animateNumber: ElementRef;

  ngAfterViewInit() {
    if (this.digit) {
      this.animateCount();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // tslint:disable-next-line: no-string-literal
    if (changes['digit']) {
      this.animateCount();
    }
  }

  animateCount() {
    if (!this.duration) {
      this.duration = 1000;
    }

    if (typeof this.digit === 'number') {
      this.counterFunc(this.digit, this.duration, this.animateNumber, this.localeToUse);
    }
  }

  counterFunc(endValue: number, durationMs: number, element: ElementRef<any>, locale: string) {
    if (!this.steps) {
      this.steps = 12;
    }
    const stepCount = Math.abs(durationMs / this.steps);
    const valueIncrement = (endValue - 0) / stepCount;

    let currentValue = 0;
    function step() {
      const numberToShow = Math.abs(Math.floor(currentValue));
      element.nativeElement.textContent = numberToShow.toLocaleString(locale);
      currentValue += valueIncrement * Math.abs(Math.sin(6) * 2 * 2);
      if (currentValue < endValue) {
        window.requestAnimationFrame(step);
      } else {
        element.nativeElement.textContent = endValue.toLocaleString(locale);
      }
    }

    step();
  }


}

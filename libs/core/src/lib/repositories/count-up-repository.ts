import { ElementRef, Injectable } from '@angular/core';
import { CountUp } from 'countup.js';

// npm install countup.js
@Injectable({
  providedIn: 'root',
})
export class CountUpRepository {
  private duration = 3;

  onCountUp(format: string, element: ElementRef, value: number) {
    switch (format)
    {
      case 'countUp-Qty':
        if (element !== undefined || element != null) this.onCountUpQty(element, value);
        break;
      case 'countUp-Percentage':
        if (element !== undefined || element != null) this.onCountUpPercentage(element, value);
        break;
      case 'countUp-Amount':
        if (element !== undefined || element != null) this.onCountUpAmount(element, value);
        break;
      default:
        console.error('Unsuported format: ',format);
        break;
    }
  }

  private onCountUpQty(element: ElementRef, value: number) {
    const countUp = new CountUp(element.nativeElement, value, {
      duration: this.duration,
      separator: ' ',
      decimalPlaces: 0
    });
    if (!countUp.error) {
      countUp.start();
    }
  }

  private onCountUpPercentage(element: ElementRef, value: number) {
    if (value == 0) {
      const countUp = new CountUp(element.nativeElement, value, {
        duration: this.duration,
        separator: ' ',
        decimalPlaces: 0,
        suffix: ' %',
      });
      if (!countUp.error) {
        countUp.start();
      }
    }
    else if (value > 0) {
      const countUp = new CountUp(element.nativeElement, value, {
        duration: this.duration,
        separator: ' ',
        decimalPlaces: 0,
        prefix: '+',
        suffix: ' %',
      });
      if (!countUp.error) {
        countUp.start();
      }
    }
    else if (value < 0) {
      const countUp = new CountUp(element.nativeElement, value, {
        duration: this.duration,
        separator: ' ',
        decimalPlaces: 0,
        suffix: ' %',
      });
      if (!countUp.error) {
        countUp.start();
      }
    }
  }

  private onCountUpAmount(element: ElementRef, value: number) {
    const countUp = new CountUp(element.nativeElement, value, {
      duration: this.duration,
      separator: ' ',
      decimal: ',',
      decimalPlaces: 2,
      suffix: ' '+'MT',
    });

    if (!countUp.error) {
      countUp.start();
    }
  }
}

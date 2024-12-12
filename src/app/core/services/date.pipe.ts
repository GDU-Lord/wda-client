import { Pipe, PipeTransform } from '@angular/core';

export function getTwoDigits(n: number) {
  return n < 10 ? "0" + n : String(n);
}

export const mon = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

export const day = [
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
];

@Pipe({
  name: 'date'
})

export class DatePipe implements PipeTransform {

  transform(value: string | null, type: 'day' | 'day-week' | 'day-week-short' | 'month' | 'time' | 'dd.mm.yy'): string {
    //2024-12-19T06:15:00.000Z
    if(value == "" || value == null) return "";
    const date = new Date(value);
    switch(type) {
      case 'day':
        return `${date.getDate()}`;
      case 'day-week':
        return `time.days.${day[date.getDay()]}`;
      case 'day-week-short':
        return `time.days_short.${day[date.getDay()]}`;
      case 'month':
        return `time.months.${mon[date.getMonth()]}`;
      case 'time':
        return `${getTwoDigits(date.getHours())}:${getTwoDigits(date.getMinutes())}`;
      case 'dd.mm.yy':
        return `${getTwoDigits(date.getDate())}.${getTwoDigits(date.getMonth())}.${getTwoDigits(+date.getFullYear().toString().slice(2,3))}`;
    }
  }

}

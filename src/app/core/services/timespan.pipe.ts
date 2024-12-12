import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timespan'
})
export class TimespanPipe implements PipeTransform {

  transform(start: string, end: string): string {
    const _start = start.split(', ');
    if(_start[0].trim() == "" && _start[1].trim() == "") return "";
    const _end = end.split(', ');
    if(_end[0].trim() == "" && _end[1].trim() == "") return start;
    if(_start[0] === _end[0])
      return `${_start[0]}, ${_start[1]}–${_end[1]}`;
    return `${_start[0]}, ${_start[1]} – ${_end[0]}, ${_end[1]}`;
  }

}

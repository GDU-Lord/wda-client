import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from '../../core/services/loader.service';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '../../core/services/date.pipe';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-calendar',
  imports: [
    DatePipe,
    TranslocoPipe,
    RouterModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.sass'
})
export class CalendarComponent implements OnInit, OnDestroy {
  
  destroy$: Subject<void> = new Subject();
  events: shortEvent[] = [];
  loaded: boolean = false;
  
  constructor(private loader: LoaderService, public transloco: TranslocoService) {}
  
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  
  ngOnInit(): void {
    this.loaded = false;
    this.loader.loadEvents('latest').pipe(takeUntil(this.destroy$)).subscribe(({data}: any) => {
      this.events = this.loader.sortEntries(data as shortEvent[]);
      this.loaded = true;
    });
  }

}
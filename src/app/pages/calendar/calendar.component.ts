import { Component, inject, makeStateKey, OnDestroy, OnInit, PLATFORM_ID, TransferState } from '@angular/core';
import { LoaderService } from '../../core/services/loader.service';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '../../core/services/date.pipe';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

const EVENTS_KEY = makeStateKey<CalendarComponent["events"]>('events');

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

  private isBrowser: boolean;
  
  constructor(private loader: LoaderService, public transloco: TranslocoService, private transferState: TransferState) {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  }
  
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  
  ngOnInit(): void {
    this.getCalendar();
  }

  getCalendar() {
    const d = this.transferState.get(EVENTS_KEY, null);
    if(d == null) return this.loadCalendar();
    this.events = d;
    this.loaded = true;
  }

  loadCalendar() {
    this.loaded = false;
    this.loader.loadEvents('latest').pipe(takeUntil(this.destroy$)).subscribe(({data}: any) => {
      this.events = this.loader.sortEntries(data as shortEvent[]);
      this.loaded = true;
      this.transferState.set(EVENTS_KEY, this.events);
    });
  }

}
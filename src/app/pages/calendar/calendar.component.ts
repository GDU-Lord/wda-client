import { Component, makeStateKey, OnDestroy, OnInit, TransferState } from '@angular/core';
import { LoaderService } from '../../core/services/loader.service';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '../../core/services/date.pipe';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';

const EVENTS_KEY = makeStateKey<CalendarComponent["events"]>('events');
const LANGUAGE_KEY = makeStateKey<string>('language');

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
  
  constructor(
    private loader: LoaderService, 
    public transloco: TranslocoService, 
    private transferState: TransferState
  ) {}
  
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  
  ngOnInit(): void {
    this.getCalendar();
  }

  getCalendar() {
    const d = this.transferState.get(EVENTS_KEY, null);
    const l = this.transferState.get(LANGUAGE_KEY, null);
    if(d == null || l !== this.transloco.getActiveLang()) return this.loadCalendar();
    this.events = d;
    this.loaded = true;
  }

  loadCalendar() {
    this.loaded = false;
    this.loader.loadEvents('latest').pipe(takeUntil(this.destroy$)).subscribe(({data}: any) => {
      this.events = this.loader.sortEntries(data as shortEvent[]);
      this.loaded = true;
      this.transferState.set(EVENTS_KEY, this.events);
      this.transferState.set(LANGUAGE_KEY, this.transloco.getActiveLang());
    });
  }

}
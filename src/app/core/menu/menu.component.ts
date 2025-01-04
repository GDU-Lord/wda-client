import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';

const langSwitch: {
  [key: string]: string;
} = {
  ua: 'de',
  de: 'ua',
};

@Component({
  selector: 'app-menu',
  imports: [
    RouterModule,
    TranslocoPipe
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.sass'
})
export class MenuComponent implements OnDestroy, OnInit {
  
  destroy$: Subject<void> = new Subject();
  langUrl: string = "/";
  
  constructor(public transloco: TranslocoService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if(event instanceof NavigationEnd) {
        this.langUrl = event.urlAfterRedirects.replace(new RegExp(`^\/${this.transloco.getActiveLang()}`), `/${langSwitch[this.transloco.getActiveLang()]}`);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }
}

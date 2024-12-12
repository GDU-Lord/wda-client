import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MenuComponent } from './core/menu/menu.component';
import { GridComponent } from './core/grid/grid.component';
import { TranslocoService } from '@jsverse/transloco';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'client';
  destroy$: Subject<void> = new Subject();

  constructor(private route: ActivatedRoute, private router: Router, private transloco: TranslocoService) {}
  
  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).pipe(takeUntil(this.destroy$)).subscribe((e) => {
      let lang = e.url.split("/")[1] ?? "de";
      if((lang !== 'ua') && (lang !== 'de'))
        this.router.navigate(["/de"]);
      else if(lang !== this.transloco.getActiveLang())
        this.transloco.setActiveLang(lang);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

}

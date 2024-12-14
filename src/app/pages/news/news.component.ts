import { Component, inject, makeStateKey, OnDestroy, OnInit, PLATFORM_ID, StateKey, TransferState } from '@angular/core';
import { GridComponent } from '../../core/grid/grid.component';
import { LoaderService } from '../../core/services/loader.service';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { isPlatformBrowser } from '@angular/common';

const GRID_KEY = makeStateKey<NewsComponent["grid"]>('grid');

@Component({
  selector: 'app-news',
  imports: [
    GridComponent,
    TranslocoPipe
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.sass'
})
export class NewsComponent implements OnInit, OnDestroy {
  
  private destroy$: Subject<void> = new Subject();
  public grid: gridEntry[] = []; 
  public loaded: number = 0;

  private isBrowser: boolean;
  
  constructor(private loader: LoaderService, private transferState: TransferState) {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  }
  
  ngOnInit(): void {
    this.getNews();
  }

  sortNews() {
    this.grid.sort((a, b) => {
      const d1 = new Date(a.date).getTime();
      const d2 = new Date(b.date).getTime();
      return d1 - d2;
    });
  }

  getNews() {
    const grid = this.transferState.get(GRID_KEY, null);
    if(grid == null) return this.loadNews();
    this.grid = grid;
    this.loaded = 2;
  }

  loadNews() {
    this.loaded = 0;
    this.loader.loadEvents('all').pipe(takeUntil(this.destroy$)).subscribe(({data}) => {
      this.grid = [...this.grid, ...data.map(event => {
        event.type = 'event';
        return {
          short_description: event.short_description,
          title: event.title,
          id: event.documentId,
          tile_cover: this.loader.imageUrl(event.tile_cover.url),
          type: event.type,
          date: event.date,
        } as gridEntry;
      })];
      this.sortNews();
      this.loaded ++;
      this.transferState.set(GRID_KEY, this.grid);
    });
    this.loader.loadArticles('all').pipe(takeUntil(this.destroy$)).subscribe(({data}) => {
      this.grid = [...this.grid, ...data.map(article => {
        article.type = 'article';
        console.log(article);
        return {
          short_description: article.short_text,
          title: article.title,
          id: article.documentId,
          tile_cover: this.loader.imageUrl(article.tile_cover.url),
          type: article.type,
          date: article.publishedAt
        } as gridEntry;
      })];
      this.sortNews();
      this.loaded ++;
      this.transferState.set(GRID_KEY, this.grid);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

}

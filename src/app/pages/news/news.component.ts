import { Component, OnDestroy, OnInit } from '@angular/core';
import { GridComponent } from '../../core/grid/grid.component';
import { LoaderService } from '../../core/services/loader.service';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';

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
  
  constructor(private loader: LoaderService) {}
  
  ngOnInit(): void {
    this.loadNews();
  }

  sortNews() {
    this.grid.sort((a, b) => {
      const d1 = new Date(a.date).getTime();
      const d2 = new Date(b.date).getTime();
      return d1 - d2;
    });
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
    });
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

}

import { Component, makeStateKey, TransferState } from '@angular/core';
import { GridComponent } from '../../core/grid/grid.component';
import { CoverComponent } from './cover/cover.component';
import { TinyTileComponent } from './tiny-tile/tiny-tile.component';
import { SmallTileComponent } from './small-tile/small-tile.component';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { LoaderService } from '../../core/services/loader.service';
import { ContactsComponent } from './contacts/contacts.component';
import { RouterModule } from '@angular/router';

const NEWS_KEY = makeStateKey<HomeComponent["mainEntries"]>('news');
const POPULAR_KEY = makeStateKey<HomeComponent["popularEntries"]>('popular');
const FEATURED_KEY = makeStateKey<HomeComponent["featuredEntry"]>('featured');
const UPCOMING_KEY = makeStateKey<HomeComponent["upcomingEntry"]>('upcoming');

const LANGUAGE_KEY = makeStateKey<string>('language');

@Component({
  selector: 'app-home',
  imports: [
    GridComponent,
    CoverComponent,
    TinyTileComponent,
    SmallTileComponent,
    TranslocoPipe,
    ContactsComponent,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent {
  
  private destroy$: Subject<void> = new Subject();

  public popularEntries: (shortEvent | shortArticle)[] = []; 
  public featuredEntry: shortEvent | shortArticle | null = null; 
  public upcomingEntry: {
    title: string;
    image: string;
    id: number;
    type: 'home' | 'article' | 'event';
  } | null = null;
  
  public mainEntries: gridEntry[] = []; 

  public loadedNews: 0 | 1 | 2 = 0;
  public loadedPopular: 0 | 1 | 2 = 0;
  public loadedFeatured: 0 | 1 | 2 = 0;
  public loadedUpcoming: 0 | 1 | 2 = 0;
  
  constructor(
    private loader: LoaderService, 
    private transferState: TransferState, 
    private transloco: TranslocoService
  ) {}
  
  ngOnInit(): void {
    this.getNews();
    this.getPopular();
    this.getFeatured();
    this.getUpcoming();
  }

  getNews() {
    const d = this.transferState.get(NEWS_KEY, null);
    const l = this.transferState.get(LANGUAGE_KEY, null);
    if(d == null || l !== this.transloco.getActiveLang()) return this.loadNews();
    this.mainEntries = d;
    this.loadedNews = 2;
  }

  getPopular() {
    const d = this.transferState.get(POPULAR_KEY, null);
    const l = this.transferState.get(LANGUAGE_KEY, null);
    if(d == null || l !== this.transloco.getActiveLang()) return this.loadPopular();
    this.popularEntries = d;
    this.loadedPopular = 2;
  }

  getFeatured() {
    const d = this.transferState.get(FEATURED_KEY, null);
    const l = this.transferState.get(LANGUAGE_KEY, null);
    if(d == null) return this.loadFeatured();
    this.featuredEntry = d;
    this.loadedFeatured = 2;
  }

  getUpcoming() {
    const d = this.transferState.get(UPCOMING_KEY, null);
    const l = this.transferState.get(LANGUAGE_KEY, null);
    if(d == null || l !== this.transloco.getActiveLang()) return this.loadUpcoming();
    this.upcomingEntry = d;
    this.loadedUpcoming = 2;
  }

  sortNews() {
    this.mainEntries.sort((a, b) => {
      const d1 = new Date(a.date).getTime();
      const d2 = new Date(b.date).getTime();
      return d1 - d2;
    });
  }

  loadNews() {
    this.loadedNews = 0;
    this.loader.loadEvents('latest').pipe(takeUntil(this.destroy$)).subscribe(({data}) => {
      this.mainEntries = [...this.mainEntries, ...data.map(event => {
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
      this.loadedNews ++;
      this.transferState.set(NEWS_KEY, this.mainEntries);
      this.transferState.set(LANGUAGE_KEY, this.transloco.getActiveLang());
    });
    this.loader.loadArticles('all').pipe(takeUntil(this.destroy$)).subscribe(({data}) => {
      this.mainEntries = [...this.mainEntries, ...data.map(article => {
        article.type = 'article';
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
      this.loadedNews ++;
      this.transferState.set(NEWS_KEY, this.mainEntries);
      this.transferState.set(LANGUAGE_KEY, this.transloco.getActiveLang());
    });
  }

  loadPopular() {
    this.loadedPopular = 0;
    this.loader.loadEvents('popular').pipe(takeUntil(this.destroy$)).subscribe(({data}) => {
      this.popularEntries = this.loader.sortEntries([...this.popularEntries, ...data.map(data => {
        data.type = 'event';
        return data;
      })]);
      this.loadedPopular ++;
      this.transferState.set(POPULAR_KEY, this.popularEntries);
    });
    this.loader.loadArticles('popular').pipe(takeUntil(this.destroy$)).subscribe(({data}) => {
      this.popularEntries = this.loader.sortEntries([...this.popularEntries, ...data.map(data => {
        data.type = 'article';
        return data;
      })]);
      this.loadedPopular ++;
      this.transferState.set(POPULAR_KEY, this.popularEntries);
      this.transferState.set(LANGUAGE_KEY, this.transloco.getActiveLang());
    });
  }

  loadFeatured() {
    this.loadedFeatured = 0;
    this.featuredEntry = null;
    this.loader.loadEvents('featured').pipe(takeUntil(this.destroy$)).subscribe(({data}) => {
      let entry = this.loader.sortEntries(data)[0];
      if(entry != null) {
        entry.type = 'event';
        this.featuredEntry = entry;
        this.transferState.set(FEATURED_KEY, this.featuredEntry);
      }
      this.loadedFeatured ++;
    });
    this.loader.loadArticles('featured').pipe(takeUntil(this.destroy$)).subscribe(({data}) => {
      let entry = this.loader.sortEntries(data)[0];
      if(entry != null) {
        entry.type = 'article';
        this.featuredEntry = this.featuredEntry ?? entry; // prioritize events
        this.transferState.set(FEATURED_KEY, this.featuredEntry);
        this.transferState.set(LANGUAGE_KEY, this.transloco.getActiveLang());
      }
      this.loadedFeatured ++;
    });
  }

  loadUpcoming() {
    this.loadedUpcoming = 0;
    let upcomingEntry: shortArticle | shortEvent | null = null;
    this.loader.loadEvents('upcoming').pipe(takeUntil(this.destroy$)).subscribe(({data}) => {
      const entry = this.loader.sortEntries(data)[0];
      if(entry != null) {
        entry.type = 'event';
        upcomingEntry = entry;
      }
      this.createCover(upcomingEntry);
    });
    this.loader.loadArticles('upcoming').pipe(takeUntil(this.destroy$)).subscribe(({data}) => {
      const entry = this.loader.sortEntries(data)[0];
      if(entry != null) {
        entry.type = 'article';
        upcomingEntry = upcomingEntry ?? entry;
      }
      this.createCover(upcomingEntry);
    });
  }

  createCover(entry: shortArticle | shortEvent | null) {
    if(entry == null) {
      this.loader.loadDefaultCover().pipe(takeUntil(this.destroy$)).subscribe(({data}) => {
        this.upcomingEntry = {
          title: data.title,
          image: data.image.url,
          id: 0,
          type: 'home'
        };
        this.loadedUpcoming ++;
        this.transferState.set(UPCOMING_KEY, this.upcomingEntry);
        this.transferState.set(LANGUAGE_KEY, this.transloco.getActiveLang());
      });
    }
    else {
      this.upcomingEntry = {
        title: entry.title,
        image: entry.tile_cover.url,
        id: entry.id,
        type: entry.type
      };
      this.loadedUpcoming ++;
      this.transferState.set(UPCOMING_KEY, this.upcomingEntry);
      this.transferState.set(LANGUAGE_KEY, this.transloco.getActiveLang());
    }
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

}

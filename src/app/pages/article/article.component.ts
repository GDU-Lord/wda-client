import { Component, makeStateKey, OnDestroy, OnInit, TransferState } from '@angular/core';
import { LoaderService } from '../../core/services/loader.service';
import { Subject, takeUntil } from 'rxjs';
import { ParserService } from '../../core/services/parser.service';
import { TextComponent } from './text/text.component';
import { ListComponent } from './text/list/list.component';
import { ImageComponent } from './image/image.component';
import { TimespanPipe } from '../../core/services/timespan.pipe';
import { DatePipe } from '../../core/services/date.pipe';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute } from '@angular/router';

interface article_data {
  id: string;
  article: any;
  title: string;
  date: string;
  endDate: string;
}

const ARTICLE_KEY = makeStateKey<article_data>('article');
const LANGUAGE_KEY = makeStateKey<string>('language');

@Component({
  selector: 'app-article',
  imports: [
    TextComponent,
    ListComponent,
    ImageComponent,
    TimespanPipe,
    DatePipe,
    TranslocoPipe
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.sass'
})
export class ArticleComponent implements OnInit, OnDestroy, article_data {
  
  private destroy$: Subject<void> = new Subject();
  public loaded: boolean = false;

  public id: string = "";
  public article: any;
  public title: string = "";
  public date: string = "";
  public endDate: string = "";

  constructor(
    private loader: LoaderService, 
    private parser: ParserService, 
    private route: ActivatedRoute, 
    private transferState: TransferState,
    private transloco: TranslocoService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getArticle();
  }

  getArticle() {
    const d = this.transferState.get(ARTICLE_KEY, null);
    const l = this.transferState.get(LANGUAGE_KEY, null);
    if((d == null) || (l !== this.transloco.getActiveLang()) || (this.getId() !== d.id)) return this.loadArticle();
    this.article = this.parser.processImages(d.article);
    this.title = d.title;
    this.date = d.date;
    this.endDate = d.endDate;
    this.loaded = true;
  }

  getId() {
    return this.route.snapshot.paramMap.get('id') ?? "";
  }

  loadArticle() {
    this.loaded = false;
    this.id = this.route.snapshot.paramMap.get('id') ?? "";
    if(this.route.snapshot.url.find(e => {
      return e.path === 'event';
    }) != null) {
      this.loader.loadEvent(this.id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        this.article = this.parser.processImages(res.data.description);
        this.title = res.data.title;
        this.date = res.data.date;
        this.endDate = res.data.end_date;
        this.loaded = true;
        const {id, article, title, date, endDate} = this;
        this.transferState.set(ARTICLE_KEY, {
          id, article, title, date, endDate
        });
        this.transferState.set(LANGUAGE_KEY, this.transloco.getActiveLang());
      });
    }
    else if(this.route.snapshot.url.find(e => {
      return e.path === 'article';
    }) != null) {
      this.loader.loadArticle(this.id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        this.article = this.parser.processImages(res.data.text);
        this.title = res.data.title;
        this.loaded = true;
        this.transferState.set(ARTICLE_KEY, this);
        this.transferState.set(LANGUAGE_KEY, this.transloco.getActiveLang());
      });
    }
  }

}

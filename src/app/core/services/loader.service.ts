import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public url = environment.api;

  constructor(private http: HttpClient, private transloco: TranslocoService) {

  }

  getStrapiLocale(lang: string) {
    return {
      de: 'de',
      ua: 'uk'
    }[lang]!;
  }

  loadEvent(id: string) {
    return this.http.get<{ data: event }>(`${this.url}/api/events/${id}?locale=${this.getStrapiLocale(this.transloco.getActiveLang())}&populate=*`);
  }

  loadArticle(id: string) {
    return this.http.get<{ data: article }>(`${this.url}/api/articles/${id}?locale=${this.getStrapiLocale(this.transloco.getActiveLang())}&populate=*`);
  }

  loadContacts() {
    return this.http.get<{ data: { contacts: string } }>(`${this.url}/api/contact?locale=${this.getStrapiLocale(this.transloco.getActiveLang())}&fields=contacts`);
  }

  loadDefaultCover() {
    return this.http.get<{ data: { title: string; image: { url: string } }}>(`${this.url}/api/default-cover?locale=${this.getStrapiLocale(this.transloco.getActiveLang())}&populate=*`);
  }

  loadEvents(type: 'all' | 'latest' | 'featured' | 'popular' | 'upcoming') { // add pages later
    let filters = "";
    switch(type) {
      case 'all':
        filters = "";
        break;
      case 'featured':
        filters = "filters[featured][$eq]=true&start=0&limit=1";
        break;
      case 'popular':
        filters = "filters[popular][$eq]=true";
        break;
      case 'upcoming':
        filters = "filters[upcoming][$eq]=true&start=0&limit=1";
        break;
      case 'latest':
        filters = `filters[date][$gte]=${new Date().toISOString()}`;
        break;
    }
    return this.http.get<{ data: shortEvent[] }>(`${this.url}/api/events?locale=${this.getStrapiLocale(this.transloco.getActiveLang())}&fields=id,title,date,type,short_description&populate=tile_cover&${filters}`);
  }

  loadArticles(type: 'all' | 'featured' | 'popular' | 'upcoming') { // add pages later
    let filters = "";
    switch(type) {
      case 'all':
        filters = "";
        break;
      case 'featured':
        filters = "filters[featured][$eq]=true&start=0&limit=1";
        break;
      case 'popular':
        filters = "filters[popular][$eq]=true";
        break;
      case 'upcoming':
        filters = "filters[upcoming][$eq]=true&start=0&limit=1";
        break;
    }
    return this.http.get<{ data: shortArticle[] }>(`${this.url}/api/articles?locale=${this.getStrapiLocale(this.transloco.getActiveLang())}&fields=id,title,short_text,publishedAt&populate=tile_cover&${filters}`);
  }

  sortEntries<T extends (shortEvent | shortArticle)>(events: T[]) {
    return events.sort((a, b) => {
      const d1 = new Date((a as any).date ?? (a as any).publishedAt).getTime();
      const d2 = new Date((b as any).date ?? (b as any).publishedAt).getTime();
      return d1 - d2;
    });
  }

  imageUrl(path: string) {
    return `${this.url}${path}`;
  }

}

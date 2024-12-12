import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { NewsComponent } from './pages/news/news.component';
import { ArticleComponent } from './pages/article/article.component';

export const routes: Routes = [
  {
    path: "ua",
    children: [
      {
        path: "calendar",
        component: CalendarComponent
      },
      {
        path: "news",
        component: NewsComponent
      },
      {
        path: "event/:id",
        component: ArticleComponent
      },
      {
        path: "article/:id",
        component: ArticleComponent
      },
      {
        path: "",
        component: HomeComponent
      },
    ]
  },
  {
    path: "de",
    children: [
      {
        path: "calendar",
        component: CalendarComponent
      },
      {
        path: "news",
        component: NewsComponent
      },
      {
        path: "event/:id",
        component: ArticleComponent
      },
      {
        path: "article/:id",
        component: ArticleComponent
      },
      {
        path: "",
        component: HomeComponent
      },
    ]
  },
  {
    path: "",
    redirectTo: "/de",
    pathMatch: "prefix"
  }
];

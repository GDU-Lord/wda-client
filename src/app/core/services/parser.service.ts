import { Injectable } from '@angular/core';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  private lastChild: any = null;
  public media: string[] = [];

  constructor(private loader: LoaderService) { }

  processChild(child: any): [boolean, any] {
    if(child.processed || (child.type === "text" && child.text === "")) return [false, child];
    if(this.lastChild != null && child.type === "image" && this.lastChild.type === "image" && this.lastChild.double == null) {
      this.lastChild.disabled = true;
      child.double = this.lastChild;
      this.lastChild = child;
      return [true, child];
    }
    if(this.lastChild != null && child.type === "image" && this.lastChild.type === "image" && this.lastChild.double != null && this.lastChild.tripple == null) {
      this.lastChild.disabled = true;
      child.double = this.lastChild;
      child.tripple = this.lastChild.double;
      this.lastChild = null;
      return [true, child];
    }
    this.lastChild = child;
    return [true, child];
  }

  getImageUrl(input: string) {
    const num = +input.replaceAll(/(\{|\})/g, "");
    return this.loader.imageUrl(this.media[num-1]);
  }

  isImage(input: string = "") {
    if(input == null) return false;
    return input.match(/\{[1-9][0-9]{0,}\}/g) != null;
    // return (url.match(this.loader.url + "/uploads") != null) && (url.match(/\.(jpg|png|jpeg)$/) != null);
  }

  setMedia(media: string[]) {
    this.media = media;
  }

  processImages(article: any) {
    return article.map((child: any) => {
      const [success, res] = this.processChild(child);
      return success ? res : child;
    });
  }

}

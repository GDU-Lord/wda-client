import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ParserService } from '../../../core/services/parser.service';
import { PlainComponent } from './plain/plain.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [
    PlainComponent,
    RouterModule,
  ],
  templateUrl: './text.component.html',
  styleUrl: './text.component.sass'
})
export class TextComponent implements OnInit {

  @Input() child!: any;
  @Input() ignoreBold: boolean = false;
  @Input() ignoreItalic: boolean = false;
  @Input() ignoreStrikethrough: boolean = false;
  @Input() ignoreUnderline: boolean = false;

  constructor(public parser: ParserService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // const [success, child] = this.parser.processChild(this.child);
    // if(success) {
    //   this.child = child;
    // }
  }

  isVideo(child: any) {
    return child.type === "link" && child.url.match(/(?<=https\:\/\/youtu\.be\/).{1,}$/g) != null;
  }

  getEmbedLink(url: string) {
    const id = url.match(/(?<=https\:\/\/youtu\.be\/).{1,}$/g);
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}&amp;controls=1`);
  }

}

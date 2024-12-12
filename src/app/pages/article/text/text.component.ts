import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ParserService } from '../../../core/services/parser.service';
import { PlainComponent } from './plain/plain.component';

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

  constructor(public parser: ParserService) {}

  ngOnInit(): void {
    const [success, child] = this.parser.processChild(this.child);
    if(success) {
      this.child = child;
    }
  }

}

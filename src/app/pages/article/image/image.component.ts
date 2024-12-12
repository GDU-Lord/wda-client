import { Component, Input, OnInit } from '@angular/core';
import { ParserService } from '../../../core/services/parser.service';

@Component({
  selector: 'app-image',
  imports: [],
  templateUrl: './image.component.html',
  styleUrl: './image.component.sass'
})

export class ImageComponent implements OnInit {
  
  @Input() child!: any;

  constructor(public parser: ParserService) {}

  ngOnInit(): void {
    const [success, child] = this.parser.processChild(this.child);
    if(success) {
      this.child = child;
    }
  }

}
import { Component, Input } from '@angular/core';
import { TextComponent } from '../text.component';

@Component({
  selector: 'app-list',
  imports: [
    TextComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.sass'
})
export class ListComponent {
  @Input() item: any;
}

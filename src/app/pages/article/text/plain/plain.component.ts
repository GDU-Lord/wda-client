import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-plain',
  imports: [],
  templateUrl: './plain.component.html',
  styleUrl: './plain.component.sass'
})
export class PlainComponent {
  @Input() text!: string;
}

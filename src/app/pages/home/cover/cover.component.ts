import { Component, Input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-cover',
  imports: [
    TranslocoPipe
  ],
  templateUrl: './cover.component.html',
  styleUrl: './cover.component.sass'
})
export class CoverComponent {
  @Input() title!: string;
  @Input() image!: string;
  constructor(public loader: LoaderService) {}
}

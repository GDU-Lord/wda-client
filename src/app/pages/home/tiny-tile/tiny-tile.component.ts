import { Component, Input } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';
import { RouterModule } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-tiny-tile',
  imports: [
    RouterModule
  ],
  templateUrl: './tiny-tile.component.html',
  styleUrl: './tiny-tile.component.sass'
})
export class TinyTileComponent {
  @Input() entry!: shortEvent | shortArticle;
  constructor(public loader: LoaderService, public transloco: TranslocoService) {}
}

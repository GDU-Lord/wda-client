import { Component, Input } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';
import { RouterModule } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-small-tile',
  imports: [
    RouterModule
  ],
  templateUrl: './small-tile.component.html',
  styleUrl: './small-tile.component.sass'
})
export class SmallTileComponent {
  @Input() entry!: shortEvent | shortArticle;
  constructor(public loader: LoaderService, public transloco: TranslocoService) {}
}

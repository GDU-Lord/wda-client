import { Component, Input } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { RouterModule } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-tile',
  imports: [
    RouterModule
  ],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.sass'
})
export class TileComponent {
  @Input() entry!: gridEntry;
  constructor(public loader: LoaderService, public transloco: TranslocoService) {}
}
import { Component, Input } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { RouterModule } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-tile',
  imports: [
    RouterModule,
    MatIconModule
  ],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.sass'
})
export class TileComponent {
  @Input() entry!: gridEntry;
  constructor(public loader: LoaderService, public transloco: TranslocoService) {}
}
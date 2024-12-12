import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-menu',
  imports: [
    RouterModule,
    TranslocoPipe
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.sass'
})
export class MenuComponent {
  constructor(public transloco: TranslocoService) {}
}

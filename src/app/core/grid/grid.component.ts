import { Component, Input, OnInit } from '@angular/core';
import { TileComponent } from './tile/tile.component';

@Component({
  selector: 'app-grid',
  imports: [
    TileComponent
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.sass'
})
export class GridComponent implements OnInit {
  @Input() size: 2 | 3 = 3;
  @Input() entries: gridEntry[] = [];
  entryRows: gridEntry[][] = [];

  ngOnInit(): void {
    let col = 0;
    let row = 0;
    this.entryRows = [[]];
    for(const entry of this.entries) {
      this.entryRows[row][col] = entry;
      col ++;
      if(col >= this.size) {
        col = 0;
        row ++;
        this.entryRows[row] = [];
      }
    }
  }
}

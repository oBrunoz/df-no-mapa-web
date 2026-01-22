import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapStore } from '../../services/map.store';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.html',
  styleUrls: ['./timeline.css']
})
export class TimelineComponent {
  readonly mapStore = inject(MapStore);
  
  readonly years = [2021, 2022, 2023, 2024, 2025];

  selectYear(year: number) {
    this.mapStore.setYear(year);
  }
}


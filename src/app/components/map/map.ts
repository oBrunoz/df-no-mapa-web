import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { Map } from 'leaflet';
import { LeafletService } from '../../services/map/leaflet.service';
import { MapStore } from '../../services/map.store';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, LeafletModule],
  templateUrl: './map.html',
  styleUrls: ['./map.css']
})
export class MapComponent {
  readonly leafletService = inject(LeafletService);
  readonly mapStore = inject(MapStore);

  get options() {
    return this.leafletService.options;
  }

  onMapReady(map: Map) {
    this.leafletService.registerMap(map);
  }
}

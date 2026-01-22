import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapStore } from '../../services/map.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  readonly mapStore = inject(MapStore);
  
  activeTab = signal<'layers' | 'info' | null>('layers');

  toggleTab(tab: 'layers' | 'info') {
    if (this.activeTab() === tab) {
      this.activeTab.set(null); // Fecha se clicar no mesmo
    } else {
      this.activeTab.set(tab);
    }
  }

  setBaseLayer(layerId: string) {
    this.mapStore.setBaseLayer(layerId);
  }

  toggleLayer(layerId: string) {
    this.mapStore.toggleLayer(layerId);
  }

  updateOpacity(layerId: string, event: any) {
    this.mapStore.setLayerOpacity(layerId, parseFloat(event.target.value));
  }
}

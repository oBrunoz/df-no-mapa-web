import { Injectable, effect, inject } from '@angular/core';
import { Map, MapOptions, tileLayer, latLng, latLngBounds, LayerGroup, layerGroup } from 'leaflet';
import { MapStore } from '../map.store';

@Injectable({
  providedIn: 'root'
})
export class LeafletService {
  private mapStore = inject(MapStore);
  private map: Map | undefined;
  
  private baseLayer: any;
  private dynamicLayers: LayerGroup = layerGroup();

  // Limites do DF
  private readonly DF_BOUNDS = latLngBounds(
    [-16.15, -48.35],
    [-15.45, -47.25]
  );

  readonly options: MapOptions = {
    zoom: 11,
    minZoom: 10,
    center: latLng(-15.793889, -47.882778), // Brasília
    zoomControl: false,
    maxBounds: this.DF_BOUNDS,
    maxBoundsViscosity: 1.0,

  };

  constructor() {
    effect(() => {
      const layers = this.mapStore.layers();
      if (this.map) {
        this.updateMapLayers(layers);
      }
    });

    effect(() => {
      const baseLayer = this.mapStore.currentBaseLayer();
      if (this.map) {
        this.updateBaseLayer(baseLayer);
      }
    });
  }

  // Chamado pelo componente quando o Leaflet inicializa
  registerMap(map: Map) {
    this.map = map;
    
    this.updateBaseLayer(this.mapStore.currentBaseLayer());
    
    this.dynamicLayers.addTo(map);
    this.dynamicLayers.setZIndex(10); // Garante que fique acima
    
    this.updateMapLayers(this.mapStore.layers());
  }

  private updateBaseLayer(layerDef: any) {
    if (!this.map) return;

    // Remove camada base anterior se existir
    if (this.baseLayer) {
      this.map.removeLayer(this.baseLayer);
    }

    // Adiciona nova camada base
    this.baseLayer = tileLayer(layerDef.url, {
      maxZoom: 19,
      attribution: layerDef.attribution,
      zIndex: 0 // Garante que fique no fundo
    });

    this.baseLayer.addTo(this.map);
    this.baseLayer.bringToBack();
  }

  // Atualiza as camadas visíveis no mapa
  private updateMapLayers(layers: any[]) {
    if (!this.map) return;

    this.dynamicLayers.clearLayers();

    layers.forEach(l => {
      if (l.visible && l.url) {
        tileLayer(l.url, { 
          opacity: l.opacity,
          maxZoom: 18
        }).addTo(this.dynamicLayers);
      }
    });
  }
}


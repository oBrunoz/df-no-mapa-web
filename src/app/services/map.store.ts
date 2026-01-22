import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from './api/api.service';
import { finalize } from 'rxjs/operators';

export interface MapLayer {
  id: string;
  name: string;
  type: 'raster' | 'geojson';
  visible: boolean;
  opacity: number;
  url?: string;
  color?: string;
  description?: string;
  loading?: boolean;
}

export interface TimelineData {
  min: number;
  max: number;
  current: number;
}

export interface BaseLayer {
  id: string;
  name: string;
  url: string;
  attribution: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapStore {
  constructor(
    private DFAPIService: ApiService
  ) {}

  readonly currentYear = signal<number>(2025);
  
  readonly baseLayers: BaseLayer[] = [
    {
      id: 'carto-dark',
      name: 'Carto Dark',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    },
    {
      id: 'carto-light',
      name: 'Carto Light',
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    },
    {
      id: 'osm',
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    },
    {
      id: 'google-satellite',
      name: 'Satélite',
      url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      attribution: '&copy; Google'
    }
  ];
  
  // mock de layers
  readonly layers = signal<MapLayer[]>([
    {
      id: 'lst',
      name: 'Ilhas de Calor',
      type: 'raster',
      visible: true,
      opacity: 1,
      description: 'Mapa de temperatura da superfície terrestre.'
    },
    {
      id: 'urban-area',
      name: 'Área Urbana',
      type: 'geojson',
      visible: false,
      opacity: 1,
      color: '#3b82f6',
      description: 'Delimitação das áreas urbanizadas.'
    },
    {
      id: 'ndvi',
      name: 'Vegetação (NDVI)',
      type: 'raster',
      visible: false,
      opacity: 1,
      description: 'Índice de vegetação por diferença normalizada.'
    }
  ]);

  readonly currentBaseLayer = signal<BaseLayer>(this.baseLayers[0]);

  readonly isAnyLayerLoading = computed(() => 
    this.layers().some(l => l.visible && l.loading)
  );
  
  setYear(year: number) {
    this.currentYear.set(year);
    
    this.layers().forEach(layer => {
      if (layer.visible && layer.type === 'raster') {
        this.loadLayerUrl(layer.id);
      }
    });
  }

  setBaseLayer(layerId: string) {
    const layer = this.baseLayers.find(l => l.id === layerId);
    if (layer) {
      this.currentBaseLayer.set(layer);
    }
  }

  toggleLayer(layerId: string) {
    this.layers.update(layers => 
      layers.map(layer => 
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );

    const layer = this.layers().find(l => l.id === layerId);
    if (layer?.visible && layer.type === 'raster') {
      this.loadLayerUrl(layerId);
    }
  }

  // requisita a URL da camada ao DFAPIService
  private loadLayerUrl(layerId: string) {
    const year = this.currentYear();
    let apiParam = layerId;

    // loading
    this.layers.update(layers => 
      layers.map(l => l.id === layerId ? { ...l, loading: true } : l)
    );

    this.DFAPIService.getTileLayers(apiParam, year)
      .pipe(
        finalize(() => {
          this.layers.update(layers => 
            layers.map(l => l.id === layerId ? { ...l, loading: false } : l)
          );
        })
      )
      .subscribe({
        next: (urls) => {
          if (urls.url_template) {
            this.layers.update(layers =>
              layers.map(l => l.id === layerId ? { ...l, url: urls.url_template } : l)
            );
          }
        },
        error: (err) => console.error(`Erro ao carregar camada ${layerId}:`, err)
      });
  }

  setLayerOpacity(layerId: string, opacity: number) {
    this.layers.update(layers =>
      layers.map(layer =>
        layer.id === layerId ? { ...layer, opacity } : layer
      )
    );
  }
}


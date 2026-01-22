import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TileLayerUrls {
  attribution: string;
  map_id: string;
  url_template: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private DFnoMapaURL = 'http://localhost:8000'; // local por enquanto

  constructor(private http: HttpClient) { }

  getTileLayers(layer: string, year: number): Observable<TileLayerUrls> {
    return this.http.get<TileLayerUrls>(`${this.DFnoMapaURL}/api/layers/${layer}`, {
      params: { year: year.toString() }
    });
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../map/map';
import { Navbar } from '../navbar/navbar'; // Vou renomear ou ajustar se precisar
import { Sidebar } from '../sidebar/sidebar';
import { TimelineComponent } from '../timeline/timeline';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, MapComponent, Navbar, Sidebar, TimelineComponent],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout {
  
}

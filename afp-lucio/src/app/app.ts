import { Component, signal } from '@angular/core';
import { DarkmodeSelector } from './darkmode-selector/darkmode-selector'; 
import { ListaPz } from './features/lista-pz/lista-pz';
import { Header } from './ui/header/header';
import { TabellaPz } from './pattern/tabella-pz/tabella-pz'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DarkmodeSelector,ListaPz,Header,TabellaPz], 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  protected readonly title = signal('afp-lucio');
}
import { Component } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
// 1. Importa la classe del componente (controlla che il percorso sia corretto)
import { DarkmodeSelector } from './darkmode-selector/darkmode-selector'; 
//import { CardPz } from './card-pz/card-pz';
import { ListaPz } from './lista-pz/lista-pz';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. Aggiungilo qui nell'array imports
 imports: [DarkmodeSelector,ListaPz], 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  // ...
}
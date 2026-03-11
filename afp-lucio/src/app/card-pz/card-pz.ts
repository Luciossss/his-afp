import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Paziente } from '../core/pazienti/pazienti.model';


@Component({
  selector: 'app-card-pz',
  standalone: true,
  imports: [CardModule, ButtonModule], 
  templateUrl: './card-pz.html',
  styleUrl: './card-pz.scss',
})
export class CardPz {

  paziente = input.required<Paziente>();

  cambiaNome(): void {
    console.log('Logica di aggiornamento per:', this.paziente().nome);
   
  }

  setColoreDiStato(): string {
    const colore = this.paziente().codiceColore.toLowerCase();
    switch (colore) {
      case 'rosso':     return 'border-red-600';
      case 'arancione': return 'border-orange-500';
      case 'giallo':    return 'border-yellow-400';
      case 'verde':     return 'border-green-600';
      case 'blu':       return 'border-blue-600';
      default:          return 'border-gray-400';
    }
}
}
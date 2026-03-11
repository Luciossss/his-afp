import { Component, signal, computed, ChangeDetectionStrategy, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

import { Paziente } from '../../core/pazienti/pazienti.model';

@Component({
  selector: 'app-tabella-pz',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    InputTextModule, 
    TableModule, 
    ButtonModule, 
    CardModule,
    TagModule
  ],
  templateUrl: './tabella-pz.html',
  styleUrl: './tabella-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabellaPz {
  // Segnale per il filtro di ricerca legato all'input HTML
  nomeFiltro = model(''); 

  // Lista iniziale dei pazienti (Segnale privato)
  readonly #pazientiIniziali = signal<Paziente[]>([
    { id: '1', eta: 45, nome: 'Mario', cognome: 'Rossi', braccialetto: 'BR-001', codiceColore: 'Verde', patologia: 'Controllo Routine', note: 'Paziente collaborativo' },
    { id: '2', eta: 38, nome: 'Franklin', cognome: 'Saint', braccialetto: 'BR-999', codiceColore: 'Rosso', patologia: 'Trauma da urto', note: 'Monitoraggio costante' },
    { id: '3', eta: 25, nome: 'Jessie', cognome: 'Pinkman', braccialetto: 'BR-420', codiceColore: 'Giallo', patologia: 'Disidratazione', note: 'Idratazione EV' }
  ]);

  // Lista filtrata calcolata automaticamente quando cambia nomeFiltro
  pazientiFiltrati = computed(() => {
    const filtro = this.nomeFiltro().toLowerCase();
    return this.#pazientiIniziali().filter((p: Paziente) => 
      p.nome.toLowerCase().includes(filtro) || 
      p.cognome.toLowerCase().includes(filtro) ||
      p.braccialetto.toLowerCase().includes(filtro)
    );
  });

  // Metodo per gestire il colore del tag (Utility per PrimeNG)
  getSeverity(codice: string): any {
    switch (codice.toLowerCase()) {
      case 'rosso': return 'danger';
      case 'giallo': return 'warning';
      case 'verde': return 'success';
      default: return 'info';
    }
  }

  cambiaNome() {
    console.log('Azione di aggiornamento attivata');
  }
}
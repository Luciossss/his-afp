import { ChangeDetectionStrategy, Component, signal, computed, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

// PERCORSO CORRETTO: esce da lista-pz, esce da features, entra in card-pz
import { CardPz } from '../../card-pz/card-pz';
import { Paziente } from '../../core/pazienti/pazienti.model';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-lista-pz',
  standalone: true,
  // IMPORTANTE: Aggiungi CardPz qui o non potrai usarlo nell'HTML
  imports: [CommonModule,TableModule, FormsModule, CardModule, ButtonModule, InputTextModule, CardPz],
  templateUrl: './lista-pz.html',
  styleUrl: './lista-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaPz {
  nomePaziente = model<string>(''); 

  listaPz = signal<Paziente[]>([
    { id: '1', nome: 'Mario', cognome: 'Rossi', braccialetto: 'BR-01', codiceColore: 'Verde', patologia: 'Controllo Routine', eta: 45, note: 'Stabile' },
    { id: '2', nome: 'Franklin', cognome: 'Saint', braccialetto: 'BR-99', codiceColore: 'Rosso', patologia: 'Trauma', eta: 38, note: 'Monitoraggio' },
    { id: '3', nome: 'Jessie', cognome: 'Pinkman', braccialetto: 'BR-420', codiceColore: 'Giallo', patologia: 'Disidratazione', eta: 25, note: 'Idratazione EV' }
  ]);

  filteredList = computed(() => {
    const search = this.nomePaziente()?.toLowerCase() || '';
    return this.listaPz().filter(pz => 
      pz.nome.toLowerCase().includes(search) || pz.cognome.toLowerCase().includes(search)
    );
  });
}
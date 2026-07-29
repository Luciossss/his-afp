import { Component, computed, inject, model, signal } from '@angular/core';
import { CardPz, Paziente } from '../card-pz/card-pz';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { catchError, of } from 'rxjs';
import { HealthStatus } from '../core/SystemStatus/HealtStatus.model';
import { SystemStatus } from '../core/SystemStatus/system-status';

interface Response<T> {
  status: string;
  data: T;
}

@Component({
  selector: 'his-lista-pz',
  standalone: true,
  imports: [InputTextModule, FormsModule, ButtonModule, CardPz, TagModule],
  templateUrl: './lista-pz.html',
  styleUrl: './lista-pz.scss',
})
export class ListaPz {
  
  readonly #http = inject(HttpClient);
  readonly #systemStatus = inject(SystemStatus); 

  nomePaziente = model<string>('');
  

  listaPz = signal<Paziente[]>([
    { id: '1', nome: 'Mario', cognome: 'Rossi', braccialetto: 'A1', eta: 30, codiceColore: 'Verde', note: 'Nessuna', patologia: 'C19' },
    { id: '2', nome: 'Luigi', cognome: 'Verdi', braccialetto: 'B2', eta: 45, codiceColore: 'Giallo', note: 'Ipertensione', patologia: 'Trauma' },
    { id: '3', nome: 'Franklin', cognome: 'Saint', braccialetto: 'C3', eta: 25, codiceColore: 'Blu', note: 'colpo arma da fuoco', patologia: 'emorraggia interna' },
    { id: '4', nome: 'Jessie', cognome: 'Pinkman', braccialetto: 'D4', eta: 27, codiceColore: 'Rosso', note: 'overdose', patologia: 'coma' },
  ]);


  healthStatus = this.#systemStatus.statoAPI;

  filteredList = computed(() => {
    return this.listaPz().filter((pz: Paziente) =>
      pz.nome.toLowerCase().includes(this.nomePaziente().toLowerCase()),
    );
  });

  constructor() {
    this.getHealthStatus();
  }

  editNomePaziente(nomePZ: string) {
    this.nomePaziente.set(nomePZ);
  }

  getHealthStatus() {
    this.#http
      .get<Response<HealthStatus>>('http://localhost:3000/health')
      .pipe(
        catchError((error) => {
          console.error('Error fetching health status:', error.error?.data);
          return of(error.error as Response<HealthStatus>); 
        }),
      )
      .subscribe((res) => {
        if (res && res.data) {
          console.table(res.data);
          this.#systemStatus.setStatus(res.data);
        }
      });
  }
}
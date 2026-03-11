import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Paziente, Daum } from './pazienti.model';
import { APIResponse } from '../SystemStatus/models/APIResponse.model';

@Injectable({
  providedIn: 'root',
})
export class PatientManager {
  readonly #http = inject(HttpClient);
  
  readonly #listaPz = signal<Paziente[]>([]);

 
  readonly listaPz = this.#listaPz.asReadonly();

  public fetchPazienti(): void {
    
    this.#http.get<APIResponse<Daum[]>>('http://localhost:3000/admission').subscribe({
      next: (res) => {
        
        const pazientiMappati: Paziente[] = res.data.map((d: Daum) => ({
         
          id: d.id.toString(), 
          nome: d.nome,
          cognome: d.cognome,
          braccialetto: d.braccialetto,
        
          eta: d.dataNascita ? this.#calcolaEta(d.dataNascita) : 0,
          codiceColore: d.coloreNome,
          note: d.noteTriage,
          patologia: d.patologiaCode
        }));

        
        this.#listaPz.set(pazientiMappati);
      },
      error: (err) => {
        console.error('Errore nel caricamento dei pazienti:', err);
      }
    });
  }

  
  #calcolaEta(dataNascita: string): number {
    const birthDate = new Date(dataNascita);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }
public filterByName(searchTerm: string): Paziente[] {
    const search = searchTerm.toLowerCase().trim();
    
    
    if (!search) {
      return this.listaPz();
    }

    return this.listaPz().filter(pz => 
      pz.nome.toLowerCase().includes(search) || 
      pz.cognome.toLowerCase().includes(search)
    );
  }
}
  


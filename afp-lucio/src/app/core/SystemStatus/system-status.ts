import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { HealthStatus, HealthStatusMock } from './HealtStatus.model';
import { APIResponse } from './models/APIResponse.model'; 

@Injectable({
  providedIn: 'root',
})
export class SystemStatus {
  #http = inject(HttpClient);

  readonly #statoAPI = signal<HealthStatus>(HealthStatusMock);

  readonly statoAPI = this.#statoAPI.asReadonly();

 
  setStatus(nuovoStato: HealthStatus) {
    this.#statoAPI.set(nuovoStato);
  }

 
  public fetchStatoAPI(): void {
    this.#http.get<APIResponse<HealthStatus>>('http://localhost:3000/health').subscribe({
      next: (res) => {
        console.log('Health Status response:', res);

        if (res && res.data) {
          this.#statoAPI.set(res.data);
        }
      },
      error: (err) => {
        console.error('Errore durante il recupero dello stato API:', err);
      }
    });
  }
}
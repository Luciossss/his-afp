import { HttpClient } from '@angular/common/http'

import { inject, Injectable, signal } from '@angular/core';
import { HealthStatus, HealthStatusMock } from './HealtStatus.model';

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
}
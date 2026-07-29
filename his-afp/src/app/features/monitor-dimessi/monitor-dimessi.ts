import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { PatientManager } from '../../core/Pazienti/patient-manager';

export interface PatientDischargedView {
  id: string;
  braccialetto: string;
  nome: string;
  cognome: string;
  codiceFiscale: string;
  dataOraDimissione: Date;
  motivoDimissione?: string;
}

@Component({
  selector: 'his-monitor-dimessi',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule, TagModule],
  templateUrl: './monitor-dimessi.html',
  styleUrl: './monitor-dimessi.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorDimessi {
  patientManager = inject(PatientManager);

  // Computed signal per filtrare i pazienti con stato 'DIM' dimessi nelle ultime 24 ore
  dischargedPatients = computed<PatientDischargedView[]>(() => {
    const pm = this.patientManager as unknown as Record<string, () => any[]>;
    const getPatients = pm['patients'] || pm['admittedPatients'] || pm['patientList'];
    const rawPatients: any[] = typeof getPatients === 'function' ? getPatients() : [];

    const now = new Date().getTime();
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

    return rawPatients
      .filter((p: any) => {
        // Controllo stato DIM (Dimesso)
        const isDimesso = p?.stato === 'DIM' || p?.status === 'DIM' || p?.statoAccettazione === 'DIM';

        // Estrazione data dimissione o ingresso
        const dischargeDateStr = p?.dataDimissione || p?.dataOraDimissione || p?.dataIngresso || p?.dataOraIngresso;
        if (!dischargeDateStr) return false;

        const dischargeTime = new Date(dischargeDateStr).getTime();
        const isWithin24Hours = (now - dischargeTime) <= twentyFourHoursInMs && dischargeTime <= now;

        return isDimesso && isWithin24Hours;
      })
      .map((p: any) => {
        const dischargeDateStr = p?.dataDimissione || p?.dataOraDimissione || p?.dataIngresso || p?.dataOraIngresso;
        return {
          id: p?.id || 'N/D',
          braccialetto: p?.codiceIdentificativo || p?.braccialetto || p?.id || 'BR-000',
          nome: p?.anagrafica?.nome || p?.nome || 'N/D',
          cognome: p?.anagrafica?.cognome || p?.cognome || 'N/D',
          codiceFiscale: p?.anagrafica?.codiceFiscale || p?.codiceFiscale || 'N/D',
          dataOraDimissione: new Date(dischargeDateStr),
          motivoDimissione: p?.motivoDimissione || 'Dimissione Ordinaria'
        };
      })
      .sort((a, b) => b.dataOraDimissione.getTime() - a.dataOraDimissione.getTime());
  });
}
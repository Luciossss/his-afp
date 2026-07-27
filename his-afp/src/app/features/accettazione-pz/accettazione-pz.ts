import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GestioneRisorse } from '../../core/Risorse/gestione-risorse';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { DatePicker } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { Fieldset } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PatientManager } from '../../core/Pazienti/patient-manager';
import { PatientAdmission } from '../../core/Pazienti/Pazienti.model';

@Component({
  selector: 'his-accettazione-pz',
  imports: [
    InputText,
    ReactiveFormsModule,
    FormsModule,
    Button,
    Message,
    DatePicker,
    SelectModule,
    Textarea,
    Fieldset,
    RadioButtonModule,
  ],
  templateUrl: './accettazione-pz.html',
  styleUrl: './accettazione-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccettazionePz {
  gestioneRisorse = inject(GestioneRisorse);
  patientManager = inject(PatientManager);

  readonly maxDate = new Date();
  readonly sexOption = [
    { code: 'M', desc: 'Maschio' },
    { code: 'F', desc: 'Femmina' },
  ];

  searchMode = signal<'cf' | 'anagrafica'>('cf');
  searchErrorMessage = signal<string | null>(null);

  readonly #fb = inject(FormBuilder);

  searchForm = this.#fb.group({
    codiceFiscale: [''],
    nome: [''],
    cognome: [''],
    dataNascita: [null as Date | null | string],
  });

  paziente = this.#fb.group({
    anagrafica: this.#fb.group({
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      dataNascita: [null as Date | string | null, [Validators.required]],
      codiceFiscale: [
        '',
        [Validators.required, Validators.pattern('[A-Z]{6}\\d{2}[A-Z]\\d{2}[A-Z]\\d{3}[A-Z]')],
      ],
      sesso: ['', [Validators.required]],
    }),
    sanitaria: this.#fb.group({
      patologia: ['', [Validators.required]],
      codiceColore: ['', [Validators.required]],
      modArrivo: ['', [Validators.required]],
      noteTriage: ['', [Validators.required, Validators.maxLength(500)]],
    }),
  });

  setSearchMode(mode: 'cf' | 'anagrafica') {
    this.searchMode.set(mode);
    this.searchForm.reset();
    this.searchErrorMessage.set(null);
  }

onSearchPatient() {
  this.searchErrorMessage.set(null);
  const mode = this.searchMode();

  const pm = this.patientManager as unknown as Record<string, () => PatientAdmission[]>;
  const getPatients = pm['patients'] || pm['admittedPatients'] || pm['patientList'];
  const patientsList: PatientAdmission[] = typeof getPatients === 'function' ? getPatients() : [];

  let foundPatient: PatientAdmission | undefined = undefined;

  if (mode === 'cf') {
    const cfInput = this.searchForm.get('codiceFiscale')?.value?.trim().toUpperCase();
    if (!cfInput) {
      this.searchErrorMessage.set('Inserire un Codice Fiscale per la ricerca.');
      return;
    }
    foundPatient = patientsList.find(
      (p) => p.anagrafica?.codiceFiscale?.toUpperCase() === cfInput
    );
  } else {
    const nomeInput = this.searchForm.get('nome')?.value?.trim().toLowerCase();
    const cognomeInput = this.searchForm.get('cognome')?.value?.trim().toLowerCase();
    const dataNascitaInput = this.searchForm.get('dataNascita')?.value;

    if (!nomeInput || !cognomeInput || !dataNascitaInput) {
      this.searchErrorMessage.set('Inserire Nome, Cognome e Data di Nascita per la ricerca.');
      return;
    }

    const targetDate = new Date(dataNascitaInput).toDateString();

    foundPatient = patientsList.find((p) => {
      const pNome = (p.anagrafica?.nome || '').toLowerCase();
      const pCognome = (p.anagrafica?.cognome || '').toLowerCase();
      const pData = p.anagrafica?.dataNascita;
      const pDateStr = pData ? new Date(pData).toDateString() : '';

      return pNome === nomeInput && pCognome === cognomeInput && pDateStr === targetDate;
    });
  }

  if (foundPatient && foundPatient.anagrafica) {
    this.paziente.get('anagrafica')?.patchValue({
      nome: foundPatient.anagrafica.nome || '',
      cognome: foundPatient.anagrafica.cognome || '',
      dataNascita: foundPatient.anagrafica.dataNascita ? new Date(foundPatient.anagrafica.dataNascita) : null,
      codiceFiscale: foundPatient.anagrafica.codiceFiscale || '',
      sesso: foundPatient.anagrafica.sesso || '',
    });
  } else {
    this.searchErrorMessage.set('Paziente non trovato in anagrafica.');
  }
}
  checkFormControl(control: string) {
    const fc = this.paziente.get(control);
    return fc?.invalid && (fc.touched || fc.dirty);
  }

  checkFormControlError(control: string, err: string) {
    const fc = this.paziente.get(control);
    if (fc && fc.hasError(err)) {
      return fc.getError(err);
    }
    return null;
  }

  onSubmit() {
    if (this.paziente.valid) {
      console.log(this.paziente.value);
      this.patientManager.admitPatient(this.paziente.value as PatientAdmission);
    } else {
      this.paziente.markAllAsTouched();
    }
  }
}
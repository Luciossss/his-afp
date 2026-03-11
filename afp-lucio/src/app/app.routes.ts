import { Routes } from '@angular/router';
import { ModificaPz } from './features/modifica-pz/modifica-pz';
import { StatoServizi } from './features/stato-servizi/stato-servizi';
import { AccettazionePz } from './features/accettazione-pz/accettazione-pz';
import { ListaPz } from './features/lista-pz/lista-pz';

export const routes: Routes = [
    {
        path:'lista-pz:id',
        component: ListaPz,
    },
    {
        path:'lista-pz',
        component: ListaPz,
    },
     {
        path:'accettazione-pz:id',
        component: AccettazionePz,
      
    },
    {
        path:'accettazione-pz',
        component: AccettazionePz,
      
    },
     {
       path:'modifica-pz:id',
       component: ModificaPz,
    },
    {
       path:'modifica-pz',
       component: ModificaPz,
    },
     {
        path:'stato-servizi:id',
        component: StatoServizi,
    },
     {
        path:'stato-servizi',
        component: StatoServizi,
    },
     {
        path:'',
        redirectTo: 'lista-pz',
        pathMatch: 'full'
    },
     {
        path:'**',
        redirectTo: 'lista-pz',
        pathMatch: 'full'
    },
];

export interface Paziente {
  id: string;
  nome: string;
  cognome: string;
  braccialetto: string;
  eta: number;
  codiceColore: string;
  note: string;
  patologia: string;
}

export interface Daum {
  id: number;
  braccialetto: string;
  dataOraIngresso: string; 
  stato: string;
  noteTriage: string;
  patologiaCode: string;
  nome: string;
  cognome: string;
  dataNascita: string;    
  coloreCode: string;     
  coloreHex: string;      
  coloreNome: string; 
  modalitaArrivoCode: string;
  modalitaArrivoDescrizione: string;  
}
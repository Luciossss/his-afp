Markdown
# Relazione Tecnica: Migrazione Architetturale HIS-AFP (UF14)

## 1. Introduzione e Architettura

### Architettura Iniziale
Inizialmente, l'infrastruttura si presentava con una rete in cui tutti i container (`fe-prod`, `fe-test`, `fe-sio`, `backend`, `db`) condividevano lo stesso spazio di indirizzamento IP e la porta `5432` del database era esposta direttamente verso l'host.

Criticità di sicurezza: se un attaccante avesse compromesso il container web di produzione (`fe-prod`), avrebbe avuto accesso diretto al servizio PostgreSQL (`db`), mettendo a rischio la privacy dei dati sanitari dei pazienti.

### Nuova Architettura Multi-Tier (Dopo)
L'infrastruttura è stata segregata in due reti Docker distinte e isolate:
1. `frontend-net`: ostracizza e isola tutti i container di frontend (`fe-prod`, `fe-test`, `fe-sio`).
2. `backend-net`: contiene l'infrastruttura dati protetta, ovvero le istanze di backend (`sio-backend-blue`, `sio-backend-green`) e il database (`sio-postgres`).

Il container `sio-gateway` (Nginx) fa da unico punto di controllo ("ponte") connesso a entrambe le reti, smistando il traffico HTTP/HTTPS e inoltrando le richieste verso il backend.

---

## 2. Dettaglio delle Implementazioni (Task)

### Task 1: Isolamento Infrastrutturale e Protezione del Dato
* Configurazione reti: create le reti `frontend-net` e `backend-net` nel `docker-compose.yml`.
* Hardening database: rimosso la mappatura diretta delle porte (`ports: - "5432:5432"`) dal servizio `db`. La porta `5432` è ora invisibile dall'esterno del perimetro Docker.
* segregazione: i frontend non sono connessi a `backend-net`, rendendo tecnicamente impossibile qualsiasi contatto diretto con il database.

### Task 2 & 3: Green/Blue deployment e migrazione zero-Downtime
* Sdoppiamento backend: configurate due istanze distinte (`sio-backend-blue` e `sio-backend-green`) connesse allo stesso database.
* Switch del traffico: il gateway nginx gestisce l'upstream per consentire il passaggio del traffico da una versione all'altra modificando la direttiva `proxy_pass` nel file `default.conf`.
* Gestione database: per evitare rotture della versione Blue quando viene rilasciata la versione Green, si adottano migrazioni additive (es. aggiunta di nuove colonne nullable o con valori di default, evitando la rimozione/rinomina immediata di campi esistenti). In questo modo entrambe le versioni del codice possono operare sullo stesso DB contemporaneamente.
* Rollback & impatto dati: in caso di rollback da Green a Blue, i dati scritti dalla versione Green rimangono persistiti nel DB.

### Task 4: Tunnel TCP per il database 
* Per consentire ai data analyst l'accesso sicuro a DBeaver/TablePlus senza esporre il DB in rete locale, è stato configurato un tunnel TCP sul Gateway tramite il modulo `stream` di Nginx.
* Il Gateway ascolta sulla porta `5432` e fa da passacarte verso `db:5432` nella rete protetta.

---

## 3. Guida per l'Esecuzione dei Test di Validazione

### Test 1: Verifica Isolamento di Rete (Task 1)
Eseguire un tentativo di risoluzione DNS/ping del database partendo dal container di produzione frontend:
```bash
docker exec -it sio-fe-prod ping db
# Risultato atteso: ping: bad address 'db' oppure Name or service not known (Fallimento
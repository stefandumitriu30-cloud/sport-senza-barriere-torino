# Sport Aperto – Torino e provincia

Sito: https://sportaperto.com

Web app per trovare dove fare sport a Torino e provincia con una disabilità (motoria, visiva, uditiva, intellettiva/relazionale): luoghi, accessibilità punto per punto, come arrivarci con i mezzi GTT e segnalazioni di chi ci è stato.

## Stato
Versione beta. I luoghi provengono da fonti pubbliche (Comune di Torino, Regione Piemonte, CIP Piemonte, Turismo Torino, stampa). I dati di accessibilità sono ancora da verificare sul posto; alcune posizioni sono indicative.

## Tecnologia
- Un solo file `index.html` (HTML, CSS, JavaScript senza framework).
- Mappa: Leaflet (leaflet.js e leaflet.css, serviti dal sito) + OpenStreetMap.
- Carattere Atkinson Hyperlegible servito dal sito (fonts.css e file .woff2), senza Google Fonts.
- Pagina info.html con informazioni, privacy e contatti.
- PWA: `manifest.webmanifest` e `sw.js` permettono di installarla sul telefono e aprirla anche offline.
- Pubblicata con GitHub Pages.

## Sicurezza
Content Security Policy rigorosa (nessuno script o stile in linea, nessuna risorsa esterna tranne le tessere della mappa), protezione dall'inserimento in altri siti, testi degli utenti sempre trattati come testo. Database Supabase con Row Level Security, permessi minimi, validazione dei dati, limiti di invio per utente e filtro dei contenuti (vedi i file supabase*.sql).

## Accessibilità
Carattere Atkinson Hyperlegible, testo grande, alto contrasto, tema scuro automatico, navigazione completa da tastiera e con lettori di schermo.

## Aggiungere o correggere un luogo
I luoghi sono nell'array `PLACES` dentro `index.html`.

# Vault — Password manager minimale client-side (secure, vendored libs)

Questa versione include le librerie vendorizzate per garantire funzionamento offline completo.

Come installare e testare (passaggi rapidi)
1. Posiziona i file del progetto nella root del repo (index.html, styles.css, main.js, manifest.json, sw.js, icons/*).
2. Rendi eseguibile lo script e scarica le librerie:
   - chmod +x download_libs.sh
   - ./download_libs.sh
   Questo crea la cartella `./libs` con:
   - libs/dexie.min.js
   - libs/argon2.min.js
   - libs/argon2.wasm
   - libs/zxcvbn.js
3. Commit & push su GitHub.
4. Abilita GitHub Pages (branch main, root). GitHub Pages serve via HTTPS.
5. Apri la pagina: il service worker (sw.js) installerà la cache (compresi i vendor). Dopo la prima visita l'app sarà disponibile offline e installabile come PWA.

Nota sul file WASM (argon2.wasm)
- argon2.min.js caricherà automaticamente `argon2.wasm` se si trova nello stesso folder `./libs`. Assicurati di non rinominarlo e di mantenerlo con lo script JS nella stessa cartella.

Sicurezza e manutenzione
- I file in ./libs sono ora parte del repository: aggiorna regolarmente le librerie (patch di sicurezza).
- Se aggiorni la versione di una libreria, aggiorna la cache name in sw.js (es. 'vault-app-shell-v3') per forzare refresh del SW.

# weather-service

Un μservizio che fornisce la temperatura esterna simulata.

## Installazione

### Requisiti

Per utilizzare questo μservizio serve Node.JS alla version v16.13.0 o successiva.
Potete installare [node manualmente](https://nodejs.org/en/download) oppure, se usate un ambiente Unix, passare
da [NVM](https://github.com/nvm-sh/nvm#install--update-script). NVM è suggerito se avete necessità di utilizzare anche
altre versioni di Node contemporaneamente.

Una volta installato NVM è necessario installare Node da terminale:

```shell
nvm install v16.13.0
```

Da questo momento in poi, ogni volta che si vuole usare Node per il progetto `weather-service` basta aprire un terminale
e lanciare questi comandi:

```shell
cd `path/to/weather-service`
nvm use
```

Il comando `nvm use` permetterà di impostare la versione di Node _in uso in quel terminale_ predefinita per il progetto.
Il comando infatti utilizza la versione indicatanel file `.nvmrc` contenuta in `path/to/weather-service` (in questo caso
la v16.13.0).

### Dipendenze

Per poter eseguire il μservizio è necessario, la prima volta, installare le dipendenze:

```shell
cd path/to/weather-service
npm i
```

Questa operazione va ripetuta se vengono aggiunte altre dipendenze.

## Esecuzione

Per lanciare il server è sufficiente eseguire questo comando:

```shell
node src/server.js
```

È possibile specificare alcuni parametri, come documentato lanciando:

```shell
node src/server.js --help
```

Di seguito vengono descritti i parametri che controllano il comportamento del server, gli errori e i delay:

| Parametro               | Effetto                                                                                        | Valore di default |
|-------------------------|------------------------------------------------------------------------------------------------|-------------------|
| -f, --frequency <ms>    | La frequenza di invio (in media) di messaggi della temperatura dal server.                     | 2000              |
| -t, --time-to-live <s>  | I secondi di vita (in media) di una connessione. Se 0 allora la connessione non si interrompe. | 60                |
| -d, --delay-prob <prob> | La probabilità che si verifichi un ritardo.                                                    | 0.2               |
| -e, --error-prob <prob> | La probabilità che si verifichi un errore.                                                     | 0.1               |
| -F, --no-failures       | Se passato non vengono simulati fallimenti nell'invio dei messaggi.                            |                   |
| -D, --no-delays         | Se passato non vengono simulati ritardi nell'invio dei messaggi.                               |                   |



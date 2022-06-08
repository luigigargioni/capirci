# capirci

poetry run python manage.py runserver

Procedura installazione CAPIRCI:

1) Installare Python 3.7.4-64 bit: qualsiasi versione del filone 3.7.x dovrebbe andare bene, ma la 3.7.4 dovrebbe essere quella che ho usato effettivamente. Usare le impostazioni d'installazione di default, controllando che venga aggiunto il PATH alle variabili di sistema ("Add Python 3.7 to PATH")(non sempre è incluso nelle impostazioni di default) e venga installato "pip".

2) Aprire il prompt dei comandi e digitare "pip install setuptools==40.8.0". Successivamente, sempre tramite prompt, recarsi nella cartella dove si è scaricato l'allegato "packages.txt" ed eseguire "pip install -r packages.txt" che installerà tutti i packages Python (con le versioni originariamente utilizzate per essere sicuri di ricreare l'ambiente da me utilizzato) necessari per l'applicativo. 

3) Installare Java "jdk-8u221" (anche update più recenti, basta che sia Java versione 8).

4) Tramite prompt spostarsi all'interno della cartella "capirci" ed eseguire "python manage.py runserver". Non chiudere il prompt dove si è lanciato il precedente comando essendo l'istanza del server. Ora aprire il browser a "localhost:8000" e comparirà l'interfaccia di login di CAPIRCI


*Tutte le istruzioni sono per Windows 64-bit, per Mac qualche comando potrebbe variare.

*Ogni errore relativo a mancanza di packages o versione di Java non corretta o altro verrà segnalato nel prompt del server durante l'utilizzo dell'applicativo.

*Per il database non ci sono problemi perchè essendo un SQLlite è tutto in un file unico (db.sqlite3) all'interno della cartella; quindi tutti i dati sono già presenti.

----------------------------------------

Credenziali:

Username: operator1
Password: Passwordoperator2
Tipo utente: operatore
(la maggior parte delle librerie sono definite con questo utente)

Username: manager1
Password: passwordmanager1
Tipo utente: gestore

Username: admin
Password: adminpassword
Tipo utente: gestore
(utente per poter entrare nel pannello di amministrazione Django ed accedere al database all'indirizzo: http://localhost:8000/admin/  )

----------------------------------------

packages.txt

certifi==2019.9.11
chardet==3.0.4
Django==2.2.7
django-mysql==3.2.0
idna==2.8
mysqlclient==1.4.5
numpy==1.17.3
opencv-python==4.1.1.26
Pillow==6.2.1
psutil==5.6.5
pytz==2019.3
pywin32==225
requests==2.22.0
six==1.13.0
sqlparse==0.3.0
stanfordcorenlp==3.9.1.1
urllib3==1.25.6
word2number==1.1
pythonping==1.0.5
nltk==3.4.5



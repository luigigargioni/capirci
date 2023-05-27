export enum MessageText {
  requiredField = 'Campo obbligatorio',
  emailNotValid = 'Formato email non valido',
  lengthNotValid = 'Lunghezza non valida',
  invalidForm = 'Dati non validi',
  sessioneExpired = 'Sessione scaduta',
  onlyEdit = 'Disponibile solo in modifica',
  passwordsNotEqual = 'Le password non corrispondono',
  newPasswordEqualOld = 'La nuova password corrisponde a quella attuale',
  incorrectPassword = 'Password errata',
  invalidCredentials = 'Credenziali non valide',
  serverError = 'Errore del server',
  logoutSuccess = 'Logout effettuato con successo',
  noConnection = 'Problema connessione server',
  passwordMismatch = 'Le password non corrispondono',
  emailAlreadyExists = 'Email già esistente',
  success = 'Operazione effettuata con successo',
  valueNotValid = 'Valore non valido',
  invalidDate = 'La data di inizio deve essere precedente alla data di fine',
}

export const MessageTextMinLength = (minLength: number) =>
  `Lunghezza minima ${minLength} caratteri`

export const MessageTextMaxLength = (maxLength: number) =>
  `Lunghezza massima ${maxLength} caratteri`

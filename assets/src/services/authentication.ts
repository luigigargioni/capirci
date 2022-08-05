import { unsetToken } from '../redux/token'
import { notificationSuccess } from '../components/Notification'
import { store } from '../store'
import {
  LocalStorageKey,
  removeFromLocalStorage,
} from '../utils/localStorageUtils'

export const logout = (notification: boolean) => {
  removeFromLocalStorage(LocalStorageKey.TOKEN)
  store.dispatch(unsetToken())
  if (notification)
    notificationSuccess('Disconnessione completata con successo')
}

import { notification } from 'antd'

enum Duration {
  success = 3,
  error = 5,
}

notification.config({
  maxCount: 3,
})

export const notificationSuccess = (msg: string) => {
  notification.success({
    message: msg,
    duration: Duration.success,
  })
}

export const notificationError = (msg: string) => {
  notification.error({
    message: msg,
    duration: Duration.error,
  })
}

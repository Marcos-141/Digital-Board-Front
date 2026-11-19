export type NotifyType = 'success' | 'error' | 'info' | 'warning'

interface NotifyState {
  show: boolean
  message: string
  type: NotifyType
  timeout: number
}

const state = reactive<NotifyState>({
  show: false,
  message: '',
  type: 'info',
  timeout: 4000,
})

export function useNotify() {
  function showNotification(message: string, type: NotifyType = 'info', timeout = 4000): void {
    state.message = message
    state.type = type
    state.timeout = timeout
    state.show = true
  }

  function success(message: string, timeout = 4000): void {
    showNotification(message, 'success', timeout)
  }

  function error(message: string, timeout = 5000): void {
    showNotification(message, 'error', timeout)
  }

  function info(message: string, timeout = 4000): void {
    showNotification(message, 'info', timeout)
  }

  function warning(message: string, timeout = 4000): void {
    showNotification(message, 'warning', timeout)
  }

  function close(): void {
    state.show = false
  }

  return {
    state,
    success,
    error,
    info,
    warning,
    close,
  }
}

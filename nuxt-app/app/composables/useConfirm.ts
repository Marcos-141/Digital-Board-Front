export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
}

interface ConfirmState {
  show: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  destructive: boolean
  resolve: ((value: boolean) => void) | null
}

const state = reactive<ConfirmState>({
  show: false,
  title: 'Confirmación',
  message: '',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  destructive: false,
  resolve: null,
})

export function useConfirm() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      state.title = options.title || 'Confirmación'
      state.message = options.message
      state.confirmText = options.confirmText || (options.destructive ? 'Eliminar' : 'Aceptar')
      state.cancelText = options.cancelText || 'Cancelar'
      state.destructive = !!options.destructive
      state.resolve = resolve
      state.show = true
    })
  }

  function handleConfirm(): void {
    state.show = false
    if (state.resolve) {
      state.resolve(true)
      state.resolve = null
    }
  }

  function handleCancel(): void {
    state.show = false
    if (state.resolve) {
      state.resolve(false)
      state.resolve = null
    }
  }

  return {
    state,
    confirm,
    handleConfirm,
    handleCancel,
  }
}

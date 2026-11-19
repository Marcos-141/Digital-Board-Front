import { isApiError, ApiError } from '~/api/errors'

export function useFormErrors() {
  const fieldErrors = ref<Record<string, string>>({})
  const generalError = ref<string | null>(null)

  function clearErrors(): void {
    fieldErrors.value = {}
    generalError.value = null
  }

  function setFieldError(field: string, message: string): void {
    fieldErrors.value[field] = message
  }

  function setErrorsFromApi(error: unknown): void {
    clearErrors()
    if (isApiError(error)) {
      if (error.kind === 'validation' && Object.keys(error.fieldErrors).length > 0) {
        fieldErrors.value = { ...error.fieldErrors }
      } else {
        generalError.value = error.message
      }
    } else if (error instanceof Error) {
      generalError.value = error.message
    } else {
      generalError.value = 'Ocurrió un error inesperado al procesar la solicitud.'
    }
  }

  return {
    fieldErrors,
    generalError,
    clearErrors,
    setFieldError,
    setErrorsFromApi,
  }
}

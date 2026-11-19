import type { ApiErrorBody } from '~/types/api'

export type ApiErrorKind =
  | 'validation'
  | 'not_found'
  | 'conflict'
  | 'bad_request'
  | 'server'
  | 'network'

export class ApiError extends Error {
  status: number
  kind: ApiErrorKind
  fieldErrors: Record<string, string>
  path?: string

  constructor(params: {
    message: string
    status: number
    kind: ApiErrorKind
    fieldErrors?: Record<string, string>
    path?: string
  }) {
    super(params.message)
    this.name = 'ApiError'
    this.status = params.status
    this.kind = params.kind
    this.fieldErrors = params.fieldErrors ?? {}
    this.path = params.path
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError || (typeof e === 'object' && e !== null && 'kind' in e && 'status' in e && 'fieldErrors' in e)
}

export function parseApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error
  }

  // Handle ofetch FetchError
  const err = error as {
    response?: {
      status?: number
      _data?: ApiErrorBody | string
    }
    statusCode?: number
    status?: number
    message?: string
    data?: ApiErrorBody | string
  }

  const status = err?.response?.status ?? err?.statusCode ?? err?.status ?? 0
  const data = (err?.response?._data ?? err?.data) as ApiErrorBody | undefined
  const fieldErrors: Record<string, string> = (typeof data === 'object' && data?.validationErrors) ? data.validationErrors : {}
  const rawMessage = (typeof data === 'object' && data?.message) ? data.message : (err?.message || '')

  if (status === 0) {
    return new ApiError({
      status: 0,
      kind: 'network',
      message: 'No pudimos conectar con el servidor. Revisa que la API esté encendida.',
      fieldErrors: {},
    })
  }

  if (status === 400) {
    if (Object.keys(fieldErrors).length > 0) {
      return new ApiError({
        status,
        kind: 'validation',
        message: rawMessage || 'Por favor revisa los campos del formulario.',
        fieldErrors,
        path: data?.path,
      })
    }
    return new ApiError({
      status,
      kind: 'bad_request',
      message: rawMessage || 'Petición incorrecta.',
      fieldErrors: {},
      path: data?.path,
    })
  }

  if (status === 404) {
    return new ApiError({
      status,
      kind: 'not_found',
      message: rawMessage || 'El recurso solicitado no fue encontrado.',
      fieldErrors: {},
      path: data?.path,
    })
  }

  if (status === 409) {
    return new ApiError({
      status,
      kind: 'conflict',
      message: rawMessage || 'El recurso ya existe o genera un conflicto.',
      fieldErrors,
      path: data?.path,
    })
  }

  if (status >= 500) {
    return new ApiError({
      status,
      kind: 'server',
      message: 'Ocurrió un problema en el servidor. Por favor intenta de nuevo más tarde.',
      fieldErrors: {},
      path: data?.path,
    })
  }

  return new ApiError({
    status,
    kind: 'bad_request',
    message: rawMessage || 'Ocurrió un error inesperado.',
    fieldErrors,
  })
}

export function getErrorMessage(e: unknown): string {
  if (isApiError(e)) {
    return e.message
  }
  if (e instanceof Error && e.message) {
    return e.message
  }
  if (typeof e === 'string') {
    return e
  }
  return 'Ocurrió un error inesperado al procesar la solicitud.'
}

import { parseApiError } from './errors'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface ApiFetchOptions {
  method?: HttpMethod
  body?: unknown
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const config = useRuntimeConfig()
  const baseURL = (config.public.apiBase as string) || 'http://localhost:8081/api/v1'

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers || {}),
  }

  if (options.body !== undefined && options.body !== null) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const res = await $fetch<T>(path, {
      baseURL,
      method: options.method || 'GET',
      body: options.body !== undefined ? (options.body as BodyInit) : undefined,
      params: options.params,
      headers,
      credentials: 'include',
      timeout: 15000,
    })
    return res as T
  } catch (error) {
    throw parseApiError(error)
  }
}

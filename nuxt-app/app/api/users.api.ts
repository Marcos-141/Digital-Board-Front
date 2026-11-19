import { apiFetch } from './client'
import type { UserRequest, UserResponse } from '~/types/api'

export const usersApi = {
  list(): Promise<UserResponse[]> {
    return apiFetch<UserResponse[]>('/users')
  },

  get(id: number): Promise<UserResponse> {
    return apiFetch<UserResponse>(`/users/${id}`)
  },

  create(data: UserRequest): Promise<UserResponse> {
    return apiFetch<UserResponse>('/users', {
      method: 'POST',
      body: data,
    })
  },

  update(id: number, data: UserRequest): Promise<UserResponse> {
    return apiFetch<UserResponse>(`/users/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  remove(id: number): Promise<void> {
    return apiFetch<void>(`/users/${id}`, {
      method: 'DELETE',
    })
  },
}

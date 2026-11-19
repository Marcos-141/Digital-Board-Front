import { apiFetch } from './client'
import type { TeacherRegistrationRequest, UserResponse } from '~/types/api'

export const authApi = {
  login(email: string, password: string): Promise<UserResponse> {
    return apiFetch<UserResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
  },

  me(): Promise<UserResponse> {
    return apiFetch<UserResponse>('/auth/me')
  },

  logout(): Promise<void> {
    return apiFetch<void>('/auth/logout', { method: 'POST' })
  },

  registerTeacher(request: TeacherRegistrationRequest): Promise<UserResponse> {
    return apiFetch<UserResponse>('/auth/register/teacher', {
      method: 'POST',
      body: request,
    })
  },
}

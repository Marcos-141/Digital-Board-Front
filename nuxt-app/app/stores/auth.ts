import { defineStore } from 'pinia'
import { usersApi } from '~/api/users.api'
import { authApi } from '~/api/auth.api'
import type { TeacherRegistrationRequest, UserRequest, UserResponse } from '~/types/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserResponse | null>(null)
  const loading = ref(false)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const canManageTopics = computed(() => user.value?.role === 'ADMIN' || user.value?.role === 'TEACHER')

  function canEdit(ownerUserId: number | null | undefined): boolean {
    if (!user.value || ownerUserId === null || ownerUserId === undefined) {
      return false
    }
    return isAdmin.value || user.value.userId === ownerUserId
  }

  async function initSession(): Promise<void> {
    if (initialized.value) return
    loading.value = true
    try {
      user.value = await authApi.me()
    } catch {
      user.value = null
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function login(email: string, password: string): Promise<UserResponse> {
    loading.value = true
    try {
      const authenticated = await authApi.login(email.trim().toLowerCase(), password)
      user.value = authenticated
      initialized.value = true
      return authenticated
    } finally {
      loading.value = false
    }
  }

  async function register(request: UserRequest): Promise<UserResponse> {
    loading.value = true
    try {
      await usersApi.create(request)
      return await login(request.email, request.password)
    } finally {
      loading.value = false
    }
  }

  async function registerTeacher(request: TeacherRegistrationRequest): Promise<UserResponse> {
    loading.value = true
    try {
      await authApi.registerTeacher(request)
      return await login(request.email, request.password)
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await authApi.logout()
    } finally {
      user.value = null
      initialized.value = true
    }
  }

  function updateCurrentUser(updated: UserResponse): void {
    user.value = updated
  }

  return {
    user,
    loading,
    initialized,
    isAuthenticated,
    isAdmin,
    canManageTopics,
    canEdit,
    initSession,
    login,
    register,
    registerTeacher,
    logout,
    updateCurrentUser,
  }
})

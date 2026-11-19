import { defineStore } from 'pinia'
import { usersApi } from '~/api/users.api'
import type { UserRequest, UserResponse } from '~/types/api'

export const useUsersStore = defineStore('users', () => {
  const users = ref<UserResponse[]>([])
  const currentUserProfile = ref<UserResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers(force = false): Promise<UserResponse[]> {
    if (users.value.length > 0 && !force) {
      return users.value
    }
    loading.value = true
    error.value = null
    try {
      const list = await usersApi.list()
      users.value = list
      return list
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Error al cargar miembros'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchUser(id: number): Promise<UserResponse> {
    loading.value = true
    try {
      const user = await usersApi.get(id)
      currentUserProfile.value = user
      return user
    } finally {
      loading.value = false
    }
  }

  async function updateUser(id: number, data: UserRequest): Promise<UserResponse> {
    loading.value = true
    try {
      const updated = await usersApi.update(id, data)
      const idx = users.value.findIndex((u) => u.userId === id)
      if (idx !== -1) {
        users.value[idx] = updated
      }
      if (currentUserProfile.value?.userId === id) {
        currentUserProfile.value = updated
      }
      return updated
    } finally {
      loading.value = false
    }
  }

  async function deleteUser(id: number): Promise<void> {
    loading.value = true
    try {
      await usersApi.remove(id)
      users.value = users.value.filter((u) => u.userId !== id)
      if (currentUserProfile.value?.userId === id) {
        currentUserProfile.value = null
      }
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    currentUserProfile,
    loading,
    error,
    fetchUsers,
    fetchUser,
    updateUser,
    deleteUser,
  }
})

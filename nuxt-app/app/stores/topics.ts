import { defineStore } from 'pinia'
import { topicsApi } from '~/api/topics.api'
import type { Topic } from '~/types/domain'

export const useTopicsStore = defineStore('topics', () => {
  const topics = ref<Topic[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const topicsMap = computed(() => {
    const map = new Map<number, Topic>()
    for (const t of topics.value) {
      map.set(t.id, t)
    }
    return map
  })

  async function fetchTopics(force = false): Promise<Topic[]> {
    if (topics.value.length > 0 && !force) {
      return topics.value
    }
    loading.value = true
    error.value = null
    try {
      const data = await topicsApi.list()
      topics.value = data
      return data
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Error al cargar temáticas'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createTopic(data: { name: string; description: string }): Promise<Topic> {
    loading.value = true
    try {
      const created = await topicsApi.create(data)
      topics.value.push(created)
      return created
    } finally {
      loading.value = false
    }
  }

  async function updateTopic(id: number, data: { name: string; description: string }): Promise<Topic> {
    loading.value = true
    try {
      const updated = await topicsApi.update(id, data)
      const idx = topics.value.findIndex((t) => t.id === id)
      if (idx !== -1) {
        topics.value[idx] = updated
      }
      return updated
    } finally {
      loading.value = false
    }
  }

  async function deleteTopic(id: number): Promise<void> {
    loading.value = true
    try {
      await topicsApi.remove(id)
      topics.value = topics.value.filter((t) => t.id !== id)
    } finally {
      loading.value = false
    }
  }

  return {
    topics,
    loading,
    error,
    topicsMap,
    fetchTopics,
    createTopic,
    updateTopic,
    deleteTopic,
  }
})

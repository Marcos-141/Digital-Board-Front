import { apiFetch } from './client'
import type { TopicRequest, TopicResponse } from '~/types/api'
import type { Topic } from '~/types/domain'

function toDomain(res: TopicResponse): Topic {
  return {
    id: res.id,
    name: res.topicName,
    description: res.description,
  }
}

export const topicsApi = {
  async list(): Promise<Topic[]> {
    const list = await apiFetch<TopicResponse[]>('/topics')
    return list.map(toDomain)
  },

  async get(id: number): Promise<Topic> {
    const res = await apiFetch<TopicResponse>(`/topics/${id}`)
    return toDomain(res)
  },

  async create(data: { name: string; description: string }): Promise<Topic> {
    const body: TopicRequest = {
      topicName: data.name.trim(),
      topicDescription: data.description.trim(),
    }
    const res = await apiFetch<TopicResponse>('/topics', {
      method: 'POST',
      body,
    })
    return toDomain(res)
  },

  async update(id: number, data: { name: string; description: string }): Promise<Topic> {
    const body: TopicRequest = {
      topicName: data.name.trim(),
      topicDescription: data.description.trim(),
    }
    const res = await apiFetch<TopicResponse>(`/topics/${id}`, {
      method: 'PUT',
      body,
    })
    return toDomain(res)
  },

  remove(id: number): Promise<void> {
    return apiFetch<void>(`/topics/${id}`, {
      method: 'DELETE',
    })
  },
}

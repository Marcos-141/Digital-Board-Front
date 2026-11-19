import { apiFetch } from './client'
import type { PostRequest, PostResponse } from '~/types/api'

function normalizePostRequest(data: PostRequest): PostRequest {
  const image = data.image && data.image.trim().length > 0 ? data.image.trim() : null
  return {
    ...data,
    title: data.title.trim(),
    description: data.description.trim(),
    image,
  }
}

export const postsApi = {
  get(id: number): Promise<PostResponse> {
    return apiFetch<PostResponse>(`/posts/${id}`)
  },

  getByTopic(topicId: number): Promise<PostResponse[]> {
    return apiFetch<PostResponse[]>(`/posts/topic/${topicId}`)
  },

  create(data: PostRequest): Promise<PostResponse> {
    return apiFetch<PostResponse>('/posts', {
      method: 'POST',
      body: normalizePostRequest(data),
    })
  },

  update(id: number, data: PostRequest): Promise<PostResponse> {
    return apiFetch<PostResponse>(`/posts/${id}`, {
      method: 'PUT',
      body: normalizePostRequest(data),
    })
  },

  remove(id: number): Promise<void> {
    return apiFetch<void>(`/posts/${id}`, {
      method: 'DELETE',
    })
  },
}

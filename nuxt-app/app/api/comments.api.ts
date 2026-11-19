import { apiFetch } from './client'
import type { CommentRequest, CommentResponse } from '~/types/api'

function normalizeCommentRequest(data: CommentRequest): CommentRequest {
  const image = data.image && data.image.trim().length > 0 ? data.image.trim() : null
  return {
    ...data,
    content: data.content.trim(),
    image,
  }
}

export const commentsApi = {
  get(id: number): Promise<CommentResponse> {
    return apiFetch<CommentResponse>(`/comments/${id}`)
  },

  getByPost(postId: number): Promise<CommentResponse[]> {
    return apiFetch<CommentResponse[]>(`/comments/post/${postId}`)
  },

  create(data: CommentRequest): Promise<CommentResponse> {
    return apiFetch<CommentResponse>('/comments', {
      method: 'POST',
      body: normalizeCommentRequest(data),
    })
  },

  update(id: number, data: CommentRequest): Promise<CommentResponse> {
    return apiFetch<CommentResponse>(`/comments/${id}`, {
      method: 'PUT',
      body: normalizeCommentRequest(data),
    })
  },

  remove(id: number): Promise<void> {
    return apiFetch<void>(`/comments/${id}`, {
      method: 'DELETE',
    })
  },
}

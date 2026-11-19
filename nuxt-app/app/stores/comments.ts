import { defineStore } from 'pinia'
import { commentsApi } from '~/api/comments.api'
import type { CommentRequest, CommentResponse } from '~/types/api'

export const useCommentsStore = defineStore('comments', () => {
  const commentsByPost = ref<Record<number, CommentResponse[]>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchByPost(postId: number): Promise<CommentResponse[]> {
    loading.value = true
    error.value = null
    try {
      const list = await commentsApi.getByPost(postId)
      // Sort oldest to newest (ascending by commentId)
      list.sort((a, b) => (a.commentId || 0) - (b.commentId || 0))
      commentsByPost.value[postId] = list
      return list
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Error al cargar comentarios'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createComment(request: CommentRequest): Promise<CommentResponse> {
    loading.value = true
    try {
      const created = await commentsApi.create(request)
      const current = commentsByPost.value[request.postId] || []
      commentsByPost.value[request.postId] = [...current, created]
      return created
    } finally {
      loading.value = false
    }
  }

  async function updateComment(id: number, request: CommentRequest): Promise<CommentResponse> {
    loading.value = true
    try {
      const updated = await commentsApi.update(id, request)
      const current = commentsByPost.value[request.postId] || []
      const idx = current.findIndex((c) => c.commentId === id)
      if (idx !== -1) {
        current[idx] = updated
        commentsByPost.value[request.postId] = [...current]
      }
      return updated
    } finally {
      loading.value = false
    }
  }

  async function deleteComment(id: number, postId: number): Promise<void> {
    loading.value = true
    try {
      await commentsApi.remove(id)
      const current = commentsByPost.value[postId] || []
      commentsByPost.value[postId] = current.filter((c) => c.commentId !== id)
    } finally {
      loading.value = false
    }
  }

  return {
    commentsByPost,
    loading,
    error,
    fetchByPost,
    createComment,
    updateComment,
    deleteComment,
  }
})

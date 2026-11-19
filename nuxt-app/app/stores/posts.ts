import { defineStore } from 'pinia'
import { postsApi } from '~/api/posts.api'
import { useTopicsStore } from './topics'
import type { PostRequest, PostResponse } from '~/types/api'

function sortPosts(posts: PostResponse[]): PostResponse[] {
  return [...posts].sort((a, b) => {
    const dateA = a.createdAt || ''
    const dateB = b.createdAt || ''
    if (dateA !== dateB) {
      return dateB.localeCompare(dateA)
    }
    return (b.postId || 0) - (a.postId || 0)
  })
}

export const usePostsStore = defineStore('posts', () => {
  const allPosts = ref<PostResponse[]>([])
  const postsByTopic = ref<Record<number, PostResponse[]>>({})
  const currentPost = ref<PostResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const partialFailures = ref<string[]>([])

  async function fetchAll(force = false): Promise<PostResponse[]> {
    if (allPosts.value.length > 0 && !force) {
      return allPosts.value
    }

    loading.value = true
    error.value = null
    partialFailures.value = []

    try {
      const topicsStore = useTopicsStore()
      const topics = await topicsStore.fetchTopics()

      if (topics.length === 0) {
        allPosts.value = []
        postsByTopic.value = {}
        return []
      }

      const results = await Promise.allSettled(
        topics.map(async (topic) => {
          const posts = await postsApi.getByTopic(topic.id)
          return { topic, posts }
        })
      )

      const accumulated: PostResponse[] = []
      const newPostsByTopic: Record<number, PostResponse[]> = {}
      const failures: string[] = []

      for (const res of results) {
        if (res.status === 'fulfilled') {
          const { topic, posts } = res.value
          newPostsByTopic[topic.id] = posts
          accumulated.push(...posts)
        } else {
          failures.push('Una o más temáticas no pudieron cargar sus publicaciones.')
        }
      }

      postsByTopic.value = newPostsByTopic
      partialFailures.value = failures
      allPosts.value = sortPosts(accumulated)

      return allPosts.value
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Error al cargar publicaciones'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchByTopic(topicId: number, force = false): Promise<PostResponse[]> {
    if (postsByTopic.value[topicId] && !force) {
      return postsByTopic.value[topicId]
    }

    loading.value = true
    try {
      const posts = await postsApi.getByTopic(topicId)
      postsByTopic.value[topicId] = posts

      // Update allPosts with this topic's refreshed posts
      const otherPosts = allPosts.value.filter((p) => p.topicId !== topicId)
      allPosts.value = sortPosts([...otherPosts, ...posts])

      return posts
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: number): Promise<PostResponse> {
    loading.value = true
    try {
      const post = await postsApi.get(id)
      currentPost.value = post
      return post
    } finally {
      loading.value = false
    }
  }

  async function createPost(request: PostRequest): Promise<PostResponse> {
    loading.value = true
    try {
      const created = await postsApi.create(request)

      // Update local state without full reload
      allPosts.value = sortPosts([created, ...allPosts.value])
      const topicId = created.topicId
      if (topicId) {
        const topicList = postsByTopic.value[topicId] || []
        postsByTopic.value[topicId] = sortPosts([created, ...topicList])
      }

      return created
    } finally {
      loading.value = false
    }
  }

  async function updatePost(id: number, request: PostRequest): Promise<PostResponse> {
    loading.value = true
    try {
      const updated = await postsApi.update(id, request)

      // Update in allPosts
      const allIdx = allPosts.value.findIndex((p) => p.postId === id)
      if (allIdx !== -1) {
        allPosts.value[allIdx] = updated
        allPosts.value = sortPosts(allPosts.value)
      }

      // Update in postsByTopic
      const topicId = updated.topicId
      if (topicId && postsByTopic.value[topicId]) {
        const tIdx = postsByTopic.value[topicId].findIndex((p) => p.postId === id)
        if (tIdx !== -1) {
          postsByTopic.value[topicId][tIdx] = updated
          postsByTopic.value[topicId] = sortPosts(postsByTopic.value[topicId])
        }
      }

      if (currentPost.value && currentPost.value.postId === id) {
        currentPost.value = updated
      }

      return updated
    } finally {
      loading.value = false
    }
  }

  async function deletePost(id: number, topicId?: number | null): Promise<void> {
    loading.value = true
    try {
      await postsApi.remove(id)

      allPosts.value = allPosts.value.filter((p) => p.postId !== id)

      const targetTopicId = topicId || currentPost.value?.topicId
      if (targetTopicId && postsByTopic.value[targetTopicId]) {
        postsByTopic.value[targetTopicId] = postsByTopic.value[targetTopicId].filter((p) => p.postId !== id)
      }

      if (currentPost.value && currentPost.value.postId === id) {
        currentPost.value = null
      }
    } finally {
      loading.value = false
    }
  }

  return {
    allPosts,
    postsByTopic,
    currentPost,
    loading,
    error,
    partialFailures,
    fetchAll,
    fetchByTopic,
    fetchById,
    createPost,
    updatePost,
    deletePost,
  }
})

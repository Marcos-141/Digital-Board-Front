const isOpen = ref(false)
const targetTopicId = ref<number | null>(null)

export function usePostDialog() {
  function open(topicId?: number | null): void {
    targetTopicId.value = topicId ?? null
    isOpen.value = true
  }

  function close(): void {
    isOpen.value = false
    targetTopicId.value = null
  }

  return {
    isOpen,
    targetTopicId,
    open,
    close,
  }
}

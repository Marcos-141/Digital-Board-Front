import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.initSession()
  }

  if (authStore.isAuthenticated) {
    const redirect = (to.query.redirect as string) || '/'
    return navigateTo(redirect)
  }
})

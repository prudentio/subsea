import type { RouteLocationRaw } from "vue-router"
import { useAuth } from "~/composables/auth"

export interface RouteMenu {
  label: string
  path?: RouteLocationRaw
}

declare module "vue-router" {
  export interface RouteMeta {
    requiresAuth?: boolean
    menu?: RouteMenu[]
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }

  const auth = useAuth()
  const requiresAuth = to.meta?.requiresAuth ?? true

  if (!requiresAuth && to.name !== "index") {
    return
  }

  if (!auth.isValid) {
    return to.name === "index" ? undefined : navigateTo("/")
  }

  try {
    await auth.getUserInfo()
  }
  catch {
    await auth.logout()
  }
})

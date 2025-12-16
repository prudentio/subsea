import type { JSendBase } from "~/services/api/base"
import { useMainServiceFetch } from "~/services/api/base"

export interface LoginResponse {
  accessToken: string
  tokenType: string
}

export interface UserResponse {
  id: string
  username: string
  name: string
  isSuperuser: boolean
  rolesId: string[]
  rolesName: string[]
  createdBy: string | null
  createdAt: string
  updatedAt: string | null
}

async function login(username: string, password: string) {
  const res = await $fetch<JSendBase<LoginResponse>>(`${window.location.origin}/api/auth/login`, {
    method: "POST",
    body: {
      username,
      password,
    },
  })
  return res.data
}

async function getUserInfo() {
  const res = await useMainServiceFetch<UserResponse>(`/user/me`, {
    method: "GET",
  })

  return res.data
}

export const AuthService = { login, getUserInfo }

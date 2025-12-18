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

export interface UserRequest {
  username: string
  password:string
  name: string
  isSuperuser: boolean
}

async function getMany() {
  const res = await useMainServiceFetch<UserResponse[]>(`/user`, {
    method: "GET",
  })

  return res.data
}

async function createUser(params:UserRequest) {
  const res = await useMainServiceFetch<UserResponse>(`/user`, {
    method: "POST",
    body:{
      username:params.username,
      password:params.password,
      name:params.name,
      isSuperuser:params.isSuperuser,
    }
  })

  return res.data
}

async function deleteUser(id:string) {
  const res = await useMainServiceFetch<UserResponse>(`/user/${id}`, {
    method: "DELETE",
  })

  return res.data
}

export const UserService = { getMany, createUser,deleteUser }

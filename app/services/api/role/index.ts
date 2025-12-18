import type { JSendBase } from "~/services/api/base"
import { useMainServiceFetch } from "~/services/api/base"

export interface RoleResponse {
  id: string
  description: string | null
  name: string
  createdBy: string | null
  createdAt: string
  updatedAt: string | null
}

export interface RoleRequest {
  description: string | null
  name: string
}

async function getMany() {
  const res = await useMainServiceFetch<RoleResponse[]>(`/role`, {
    method: "GET",
  })

  return res.data
}

async function createRole(params:RoleRequest) {
  const res = await useMainServiceFetch<RoleResponse>(`/role`, {
    method: "POST",
    body:{
      name:params.name,
      description:params.description,
    }
  })

  return res.data
}

async function deleteRole(id:string) {
  const res = await useMainServiceFetch<RoleResponse>(`/role/${id}`, {
    method: "DELETE",
  })

  return res.data
}

export const RoleService = { getMany, createRole, deleteRole }

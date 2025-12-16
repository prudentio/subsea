import type { NitroFetchOptions } from "nitropack"
import { omit } from "es-toolkit"
import { get } from "es-toolkit/compat"
import { useAuth } from "~/composables/auth"

export interface JSendBase<T = unknown> {
  data: T
  pagination?: Pagination
  message?: string
}

export interface Pagination {
  page: number
  perPage: number
  totalItems: number
}

export interface MainServiceOpt extends NitroFetchOptions<string> {
  removeAuth?: boolean
  cbor?: Uint8Array<ArrayBufferLike>
}

/**
 * Handle fetch request
 * @param path include leading slash /
 * @param opt
 */
export function useBaseApiUrl() {
  const defaultBaseApiUrl = `${window.location.origin}/api`
  const { apiUrl } = useRuntimeConfig().public
  return apiUrl || defaultBaseApiUrl
}

export async function useMainServiceFetch<R, O extends MainServiceOpt = MainServiceOpt>(path: string, opt: O = {} as O): Promise<JSendBase<R>> {
  const auth = useAuth()
  const apiUrlWrapped = useBaseApiUrl()

  const objHeader = get(opt, "headers", {}) as Record<string, string>
  const headers = new Headers(objHeader)
  if (!get(opt, "removeAuth", false)) {
    headers.set("Authorization", `Bearer ${auth.jwtToken ?? ""}`)
  }

  const bodyInCbor = opt.cbor

  if (bodyInCbor != null) {
    headers.set("Content-Type", "application/cobr")
  }

  return await $fetch<JSendBase<R>>(apiUrlWrapped + path, {
    ...omit(opt, ["headers", "removeAuth"]),
    headers,
    ...(bodyInCbor == null ? {} : { body: bodyInCbor }),
  })
}

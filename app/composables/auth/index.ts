import { useLocalStorage } from "@vueuse/core"
import { jwtDecode } from "jwt-decode"
import { defineStore } from "pinia"
import { AuthService } from "~/services/api/auth"

export const useAuth = defineStore("authStore", () => {
  const jwtToken = useLocalStorage("authToken", undefined as string | undefined)
  const jwtClaims = computed(() => {
    if (jwtToken.value == null) {
      return
    }

    return jwtDecode<{ sub: string, iat: number, exp: number }>(jwtToken.value)
  })
  
  const userId = ref<string>()

  const state = ref({
    username: "",
    name: "",
    id: "",
    roleId: [""],
    roleName: [""],
  })

  async function getUserInfo() {
    const userinfo = await AuthService.getUserInfo()
    state.value.username = userinfo.username
    state.value.name = userinfo.name
    state.value.id = userinfo.id
    state.value.roleId = userinfo.rolesId
    state.value.roleName = userinfo.rolesName
  }

  const isValid = computed(() => jwtToken.value != null)

  async function login(username: string, password: string) {
    const data = await AuthService.login(username, password)
    jwtToken.value = data.accessToken
    const subsClaim = jwtClaims.value?.sub
    if (subsClaim == null) {
      throw new Error(
        "Invalid JWT token, sub claim is missing",
      )
    }

    userId.value = subsClaim
    getUserInfo()
  }

  function logout() {
    state.value.username = ""
    state.value.id = ""
    state.value.name = ""
    state.value.roleId = []
    state.value.roleName = []
    jwtToken.value = undefined
  }

  return {
    jwtToken,
    jwtClaims,
    userId,
    state,
    isValid,

    login,
    logout,
    getUserInfo,
  }
})

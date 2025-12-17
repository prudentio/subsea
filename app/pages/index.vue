<script lang="ts" setup>
import { useAuth } from '~/composables/auth';

const usernameValue = ref<string>()
const password = ref<string>()
const router = useRouter()
const auth = useAuth()

const errorLogin = ref<string>()

async function handleLogin() {
  if (usernameValue.value == null || password.value == null) {
    return
  }

  try {
    errorLogin.value = undefined
    await auth.login(usernameValue.value, password.value)
    router.push('/my-info')
  }
  catch (err) {
    console.error(err)
    errorLogin.value = "username or password is wrong"
  }
}
</script>

<template>
  <div class="mx-10 mt-5">
    <div>
      login

      <div>
        <label for="username">username </label>
        <InputText id="username" name="username" fluid v-model="usernameValue" variant="filled"
          placeholder="username" />
      </div>

      <label for="password">password</label>
      <Password input-id="password" name="password" toggle-mask :feedback="false" fluid variant="filled"
        v-model="password" placeholder="password" />
    </div>

    <div class="mt-5">
      <Button label="submit" @click="handleLogin" />
    </div>

    <template v-if="errorLogin != null">
      <div class="text-red-500">{{ errorLogin }}</div>
    </template>
  </div>
</template>


<style></style>
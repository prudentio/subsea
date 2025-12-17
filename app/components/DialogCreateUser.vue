<script lang="ts" setup>
import { ref } from 'vue'
import { UserService, type UserRequest } from '~/services/user';

const visible = defineModel<boolean>("visible", {
    default: false,
})

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'created'): void
}>()

const username = ref('')
const password = ref('')
const name = ref('')
const isSuperuser = ref(false)

const loading = ref(false)
const error = ref<string | null>(null)

function close() {
    emit('update:visible', false)
    reset()
}

function reset() {
    username.value = ''
    password.value = ''
    name.value = ''
    isSuperuser.value = false
    error.value = null
}

async function submit() {
    if (!username.value || !password.value) {
        error.value = 'Username and password are required'
        return
    }

    loading.value = true
    error.value = null

    const params: UserRequest = {
        username: username.value,
        password: password.value,
        name: name.value || "",
        isSuperuser: isSuperuser.value,
    }

    try {
        await UserService.createUser(params)
    } catch (e: any) {
        error.value =
            e?.data?.message || 'Failed to create user'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <Dialog header="Create User" :visible="visible" modal class="w-120">
        <div class="flex flex-col gap-4">
            <div>
                <label class="block mb-1">Username</label>
                <InputText v-model="username" fluid />
            </div>

            <div>
                <label class="block mb-1">Password</label>
                <Password v-model="password" toggle-mask :feedback="false" fluid />
            </div>

            <div>
                <label class="block mb-1">Name</label>
                <InputText v-model="name" fluid />
            </div>

            <div class="flex items-center gap-2">
                <Checkbox v-model="isSuperuser" binary />
                <label>Superuser</label>
            </div>

            <div v-if="error" class="text-red-500">
                {{ error }}
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" severity="secondary" @click="close" />
            <Button label="Create" :loading="loading" @click="submit" />
        </template>
    </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { RoleService, type RoleRequest } from '~/services/role';
import { UserService, type UserRequest } from '~/services/user';

const visible = defineModel<boolean>("visible", {
    default: false,
})

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'created'): void
}>()

const description = ref('')
const name = ref('')

const loading = ref(false)
const error = ref<string | null>(null)

function close() {
    emit('update:visible', false)
    reset()
}

function reset() {
    description.value = ''
    name.value = ''
    error.value = null
}

async function submit() {
    if (!name.value || !description.value) {
        error.value = 'name and description are required'
        return
    }

    loading.value = true
    error.value = null

    const params: RoleRequest = {
        description: description.value,
        name: name.value || "",
    }

    try {
        await RoleService.createRole(params)
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
                <label class="block mb-1">Name</label>
                <InputText v-model="name" fluid />
            </div>

            <div>
                <label class="block mb-1">Description</label>
                <InputText v-model="description" fluid />
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

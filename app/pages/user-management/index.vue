<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { UserService, type UserResponse } from '~/services/user'

const users = ref<UserResponse[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const userCreateVisible = ref<boolean>(false)

async function fetchUsers() {
    try {
        const data = await UserService.getMany()
        users.value = data
    }
    catch (err) {
        console.error(err)
    }
}

function openVisible() {
    userCreateVisible.value = true
}

async function deleteUser(id: string) {
    try {
        await UserService.deleteUser(id)
    }
    catch (err) {
        console.error(err)
    }
}

onMounted(fetchUsers)
</script>

<template>
    <div class="mx-10 mt-5">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">User Management</h2>
            <Button label="Create User" @click="openVisible" />
        </div>

        <DataTable :value="users" :loading="loading" stripedRows responsiveLayout="scroll">
            <Column field="username" header="Username" />
            <Column field="name" header="Name" />

            <Column header="Superuser">
                <template #body="{ data }">
                    <Tag :value="data.isSuperuser ? 'YES' : 'NO'" :severity="data.isSuperuser ? 'danger' : 'info'" />
                </template>
            </Column>

            <Column field="createdAt" header="Created At">
                <template #body="{ data }">
                    {{ new Date(data.createdAt).toLocaleString() }}
                </template>
            </Column>

            <Column header="Actions">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button severity="danger" @click="() => deleteUser(data.id)">
                            <div class="i-[hugeicons--delete-01]"></div>
                        </Button>
                    </div>
                </template>
            </Column>
        </DataTable>

        <div v-if="error" class="text-red-500 mt-3">
            {{ error }}
        </div>

        <DialogCreateUser v-model:visible="userCreateVisible" />
    </div>
</template>

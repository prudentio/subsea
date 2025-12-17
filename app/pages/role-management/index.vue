<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { RoleService, type RoleResponse } from '~/services/role'

const roles = ref<RoleResponse[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const userCreateVisible = ref<boolean>(false)

async function fetchRole() {
    try {
        const data = await RoleService.getMany()
        roles.value = data
    }
    catch (err) {
        console.error(err)
    }
}

function openVisible() {
    userCreateVisible.value = true
}

async function deleteRole(id: string) {
    try {
        await RoleService.deleteRole(id)
    }
    catch (err) {
        console.error(err)
    }
}

onMounted(fetchRole)
</script>

<template>
    <div class="mx-10 mt-5">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Role Management</h2>
            <Button label="Create User" @click="openVisible" />
        </div>

        <DataTable :value="roles" :loading="loading" stripedRows responsiveLayout="scroll">
            <Column field="name" header="Name" />
            <Column field="description" header="Description" />
            <Column field="createdAt" header="Created At">
                <template #body="{ data }">
                    {{ new Date(data.createdAt).toLocaleString() }}
                </template>
            </Column>

            <Column header="Actions">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button severity="danger" @click="() => deleteRole(data.id)">
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

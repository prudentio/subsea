<script lang="ts" setup>
import { useAuth } from '~/composables/auth';

definePageMeta({
  requiresAuth: true,
})

const auth = useAuth()

</script>

<template>
  <div class="text-red-500">
  {{ auth.state.name }} {{ auth.state.username }}
  </div>
</template>


<style>

</style>
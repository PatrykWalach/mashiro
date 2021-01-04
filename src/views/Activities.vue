<script lang="ts" setup>
import ActivitiesList from '@/components/ActivitiesList.vue'
import Viewer from '@/components/Viewer.vue'
import { onErrorCaptured, ref } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  if (err instanceof Error) {
    error.value = err
    return false
  }
})

function refetch() {
  error.value = null
}
</script>

<template>
  <div v-if="error">
    {{ error }}
    <button @click="refetch">refetch</button>
  </div>
  <Suspense v-else>
    <template #fallback>Loading...</template>
    <div>
      <Viewer></Viewer>
      <ActivitiesList></ActivitiesList>
    </div>
  </Suspense>
</template>

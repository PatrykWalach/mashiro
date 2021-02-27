<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: ['activities'],
})
</script>

<template>
  <ul>
    <li v-for="activity of activities" :key="activity.id">{{ activity }}</li>
  </ul>
</template>

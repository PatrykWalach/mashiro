<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: ['activities'],
})
</script>

<template>
  <div>{{ activities }}</div>
</template>

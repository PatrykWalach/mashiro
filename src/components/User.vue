<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: ['user'],
})
</script>

<template>
  <div>{{ user }}</div>
</template>

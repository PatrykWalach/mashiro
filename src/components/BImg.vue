<template>
  <img :src="src" alt="" class="h-auto w-full" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: { src: { default: '', type: String } },
})
</script>

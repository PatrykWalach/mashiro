<template>
  <div class="home">
    <img src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  layout: 'custom',
  name: 'home',
  components: {
    HelloWorld,
  },
})
</script>

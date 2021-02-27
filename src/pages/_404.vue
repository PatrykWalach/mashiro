<template>
  <div
    class="flex-1 min-h-full min-w-full rounded-3xl bg-white shadow-xl p-10 lg:p-20 text-gray-800 relative md:flex items-center text-center md:text-left"
  >
    <div class="w-full md:w-1/2">
      <div class="mb-10 lg:mb-20">
        <img id="logoipsum" src="@/assets/logo.svg" alt="logo" class="w-48" />
      </div>
      <div class="mb-10 md:mb-20 text-gray-600 font-light">
        <h1
          class="font-black uppercase text-3xl lg:text-5xl text-yellow-500 mb-10"
        >
          You seem to be lost!
        </h1>
        <p>The page you're looking for isn't available.</p>
        <p>Try searching again or use the Go Back button below.</p>
      </div>
      <div class="mb-20 md:mb-0">
        <router-link
          to="/"
          class="text-lg font-light outline-none focus:outline-none transform transition-all hover:scale-110 text-yellow-500 hover:text-yellow-600"
        >
          <i class="mdi mdi-arrow-left mr-2"></i>Go Back
        </router-link>
      </div>
    </div>
    <div class="w-full md:w-1/2 text-center">
      <img
        src="@/assets/404.svg"
        alt="404 image"
        class="w-full max-w-lg lg:max-w-full mx-auto"
      />
      <span class="text-xs text-gray-300"
        >Business vector created by pikisuperstar - www.freepik.com</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  layout: 'error',
})
</script>

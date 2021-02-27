<template>
  <!-- <div class="mt-1 relative rounded-md shadow-sm">
    <div
      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
    >
      <span class="text-gray-500 sm:text-sm"> $ </span>
    </div>
    <input
      type="text"
      class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
    />
  </div> -->
  <input type="text" class="rounded p-4 block w-full" v-model="syncedValue" />
  <!-- <div class="border-gray-300">
    <input
      v-bind="$attrs"
      type="text"
      class="block border-gray-300 w-full p-4"
    />
  </div> -->
</template>
<script lang="ts">
import { watch, customRef, defineComponent } from 'vue'

function useDebouncedRef<T>(value: T, delay = 200) {
  let timeout: NodeJS.Timeout
  return customRef<T>((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      },
    }
  })
}

export default defineComponent({
  props: ['value'],
  setup(props, { emit }) {
    // const syncedValue = computed({
    //   get: () => props.value,
    //   set: (v) => emit('update:value', v),
    // })

    const syncedValue = useDebouncedRef(props.value, 200)

    watch(syncedValue, (v) => emit('update:value', v))

    return {
      syncedValue,
    }
  },
})
</script>

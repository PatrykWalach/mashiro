<template>
  <svg viewBox="0 0 24 24" :style="style">
    <path :d="mdi[path]" :style="pathStyle" />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import * as mdi from '@mdi/js'

export default defineComponent({
  props: {
    path: { type: String as PropType<keyof typeof mdi>, required: true },
    size: { type: [String, Number], default: null },
    color: { type: String, default: 'currentColor' },
  },
  setup(props) {
    const style = computed(() => {
      if (props.size === null) {
        return null
      }
      const width =
        typeof props.size === 'string' ? props.size : `${props.size * 1.5}rem`

      return {
        width,
        height: width,
      }
    })

    const pathStyle = computed(() => ({
      fill: props.color,
    }))

    return { pathStyle, style, mdi }
  },
})
</script>

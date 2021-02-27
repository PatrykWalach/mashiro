<!-- <template>
  <div><slot></slot></div>
</template> -->

<script lang="ts">
import { defineComponent, h } from 'vue'

export default defineComponent({
  props: ['masonry', 'cols'],
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        { class: [''], style: ['column-count: 3;', 'column-gap: 10px;'] },
        slots.default?.().map((v) => v),
      )
  },
})
</script>

<style scoped></style>

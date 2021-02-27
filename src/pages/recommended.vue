<template>
  <div
    v-if="data"
    class="p-2 grid gap-1"
    style="grid-template-columns: repeat(auto-fit, minmax(180px, auto))"
  >
    <div
      v-for="(media, i) in (data.anilistPage && data.anilistPage.media) || []"
      :key="media.id"
      class="rounded overflow-hidden"
    >
      <img
        :src="media.coverImage.extraLarge"
        height="690"
        width="460"
        class="h-auto w-full"
      />
      {{ i }}
    </div>
  </div>
</template>

<script lang="ts">
import { useRecommendedQuery } from '@/__generated__/globalTypes'
import { gql } from '@urql/vue'
import { defineComponent } from 'vue'

export const RECOMMENDED_QUERY = gql`
  query Recommended {
    # anilistPage {
    #   media {
    #     id
    #     coverImage {
    #       extraLarge
    #     }
    #   }
    # }
    # activities {
    #   id
    # }
    viewer {
      id
      listEntries {
        id
      }
    }
  }
`

export default defineComponent({
  setup() {
    const { data } = useRecommendedQuery()

    return { data }
  },
})
</script>

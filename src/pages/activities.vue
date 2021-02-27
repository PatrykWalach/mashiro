<script lang="ts">
import { gql } from '@urql/vue'
import { defineAsyncComponent, defineComponent } from 'vue'
import { useActivitiesQuery } from '../__generated__/globalTypes'

const LazyUser = defineAsyncComponent(() => import('@/components/User.vue'))
const LazyActivities = defineAsyncComponent(
  () => import('@/components/ActivitiesList.vue'),
)

export const ACTIVITIES_QUERY = gql`
  query Activities {
    viewer {
      name
      id
    }
    # activities {
    #   id
    # }
  }
`

export default defineComponent({
  components: {
    LazyUser,
    LazyActivities,
  },
  async setup() {
    const { data, error } = await useActivitiesQuery()

    return {
      data,
      error,
    }
  },
})
</script>

<template>
  <div v-if="data">
    <LazyUser v-if="data.anilistViewer" :user="data.anilistViewer"></LazyUser>
    <LazyActivities :activities="data.activities"></LazyActivities>
  </div>
  <div v-else-if="error">{{ error.toString() }}</div>
</template>

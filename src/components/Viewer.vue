<script lang="ts" setup>
import { useSuspenseQuery } from '@/background/hooks/useSuspenseQuery'
import { useViewerQuery } from '@/__generated__/globalTypes'
import { gql } from '@apollo/client'

const VIEWER_QUERY = gql`
  query Viewer {
    anilistViewer {
      name
      id
    }
  }
`

const query = useViewerQuery()

const { result } = await useSuspenseQuery(query)
</script>

<template>
  <div>{{ result.anilistViewer }}</div>
</template>

<script lang="ts" setup>
import { useSuspenseQuery } from '@/background/hooks/useSuspenseQuery'
import { useActivitiesListQuery } from '@/__generated__/globalTypes'
import { gql } from '@apollo/client'

const ACTIVITIES_LIST_QUERY = gql`
  query ActivitiesList {
    activities {
      id
    }
  }
`

const query = useActivitiesListQuery()

const { result } = await useSuspenseQuery(query)
</script>

<template>
  <div>{{ result.activities }}</div>
</template>

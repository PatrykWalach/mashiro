import { UseQueryReturn } from '@vue/apollo-composable'
import { nextTick } from 'vue'

export const useSuspenseQuery = <R, V>(query: UseQueryReturn<R, V>) =>
  new Promise<UseQueryReturn<R, V>>((resolve, reject) => {
    query.onResult(() => {
      nextTick(() => resolve(query))
    })
    query.onError(reject)
  })

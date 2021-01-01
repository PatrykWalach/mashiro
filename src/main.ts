// import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition, Reference } from '@apollo/client/utilities'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { TypedTypePolicies } from './__generated__/client'
import instrospection from './__generated__/instrospection'

const typePolicies: TypedTypePolicies = {
  Query: {
    fields: {
      activities: {
        merge(existing: Reference[] = [], incoming: unknown[]) {
          return [...existing, ...incoming]
        },
      },
    },
  },
}

const client = new ApolloClient({
  link: split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    new WebSocketLink({
      uri: 'ws://127.0.0.1:5000/graphql',
      options: {
        reconnect: true,
      },
    }),
    new HttpLink({ uri: 'http://127.0.0.1:5000' }),
  ),
  cache: new InMemoryCache({
    possibleTypes: instrospection.possibleTypes,
    typePolicies,
  }),
})

createApp(App).use(router).provide(DefaultApolloClient, client).mount('#app')

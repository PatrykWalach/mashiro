import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

function setAuthorizationHeader(headers: any = {}) {
  const token =
    process.env.VUE_APP_BEARER_TOKEN ?? localStorage.getItem('token')

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
}

import urql, {
  createClient,
  defaultExchanges,
  subscriptionExchange,
} from '@urql/vue'

import { SubscriptionClient } from 'subscriptions-transport-ws'
const subscriptionClient = new SubscriptionClient(
  `ws://localhost:${process.env.VUE_APP_SERVER_PORT}/graphql`,
  { reconnect: true },
)

createApp(App)
  .use(router)
  .use(
    urql,
    createClient({
      url: `http://localhost:${process.env.VUE_APP_SERVER_PORT}/graphql`,
      suspense: true,
      fetchOptions: setAuthorizationHeader,
      exchanges: [
        ...defaultExchanges,
        // dedupExchange,
        // cacheExchange,
        // retryExchange(options),
        // fetchExchange,
        subscriptionExchange({
          forwardSubscription: operation =>
            subscriptionClient.request(operation),
        }),
      ],
    }),
  )

  .mount('#app')

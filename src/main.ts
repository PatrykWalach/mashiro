// import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// const client = new ApolloClient({
//   uri: 'http://127.0.0.1:5000/graphql',
//   cache: new InMemoryCache(),
// })

createApp(App)
  .use(router)
  .mount('#app')

// const getTypes = (item: object[]) =>
//   item.reduce((acc: any, item: any) => {
//     for (const key in item) {
//       if (!(key in acc)) {
//         acc[key] = []
//       }
//       const type = typeof item[key]
//       if (!acc[key].includes(type)) {
//         acc[key].push(type)
//       }
//     }
//     return acc
//   }, {})

// setTimeout(() => ipcRenderer.invoke('test').then(console.log), 2000)
